// Penyetel bingkai eksplorasi.
//
// Membandingkan dua cara menggeser Bumi ke tepi kanan:
//
//   A. BIDIK MIRING (yang dipakai sekarang) — kamera diarahkan menjauh dari
//      planet. Sederhana, tetapi begitu pusat bola meninggalkan sumbu optik,
//      perspektif memproyeksikannya sebagai ELIPS. Makin lebar lensa dan makin
//      jauh dari sumbu, makin lonjong.
//
//   B. FRUSTUM ASIMETRIS (setViewOffset) — kamera tetap menatap planet, yang
//      digeser adalah jendela gambarnya. Bola tetap di sumbu optik sehingga
//      proyeksinya LINGKARAN SEMPURNA, berapa pun pergeserannya. Ini prinsip
//      lensa shift pada fotografi arsitektur.
//
// Kebenaran diameter diambil dari SILUET yang benar-benar diproyeksikan, bukan
// dari radius sudut. Rumus radius sudut di getDotScreenPosition memakai
// tan(alpha) = R/d, padahal bola yang benar memakai sin(alpha) = R/d; pada
// ukuran tampak sebesar bingkai ini selisihnya belasan persen.
import { PerspectiveCamera, MathUtils, Vector3 } from "three";

const EARTH_RADIUS = 1;
// FOV dipakai lewat parameter tiap varian, bukan konstanta global.
const AZIMUTH_NEAR = 0.18;
const ELEVATION_NEAR = 0.15;

const tanHalf = (deg) => Math.tan(MathUtils.degToRad(deg) / 2);

/** Siluet sejati: lingkaran singgung, diproyeksikan lalu diukur kotak batasnya. */
function silhouette(camera, width, height, samples = 720) {
  const P = camera.position;
  const d = P.length();
  const centre = P.clone().multiplyScalar((EARTH_RADIUS * EARTH_RADIUS) / (d * d));
  const ring = EARTH_RADIUS * Math.sqrt(1 - (EARTH_RADIUS * EARTH_RADIUS) / (d * d));
  const n = P.clone().normalize();
  const helper = Math.abs(n.x) < 0.9 ? new Vector3(1, 0, 0) : new Vector3(0, 1, 0);
  const u = new Vector3().crossVectors(n, helper).normalize();
  const v = new Vector3().crossVectors(n, u).normalize();

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < samples; i += 1) {
    const a = (i / samples) * Math.PI * 2;
    const ndc = centre.clone()
      .addScaledVector(u, Math.cos(a) * ring)
      .addScaledVector(v, Math.sin(a) * ring)
      .project(camera);
    const sx = (ndc.x * 0.5 + 0.5) * width;
    const sy = (0.5 - ndc.y * 0.5) * height;
    if (sx < minX) minX = sx;
    if (sx > maxX) maxX = sx;
    if (sy < minY) minY = sy;
    if (sy > maxY) maxY = sy;
  }
  const w = maxX - minX;
  const h = maxY - minY;
  return { w, h, rasio: w / h, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, minX, maxX, minY, maxY };
}

/** Tempatkan kamera pada jarak d dengan orientasi orbit yang sama. */
function place(camera, d) {
  const ce = Math.cos(ELEVATION_NEAR);
  camera.position.set(
    d * ce * Math.sin(AZIMUTH_NEAR),
    d * Math.sin(ELEVATION_NEAR),
    d * ce * Math.cos(AZIMUTH_NEAR),
  );
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
}

/* --- A. bidik miring ------------------------------------------------------- */
function variantAim({ W, H, fov, distance, aimX, aimY }) {
  const aspect = W / H;
  const cam = new PerspectiveCamera(fov, aspect, 0.1, 4000);
  place(cam, distance);
  const th = tanHalf(fov);
  const right = new Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
  const up = new Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
  const target = new Vector3(0, 0, 0)
    .addScaledVector(right, aimX * distance * th * aspect)
    .addScaledVector(up, aimY * distance * th);
  cam.lookAt(target);
  cam.updateMatrixWorld(true);
  cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
  return silhouette(cam, W, H);
}

/* --- B. frustum asimetris -------------------------------------------------- */
// Jendela (W,H) adalah potongan dari bingkai maya (fullW, fullH). Bumi berada di
// pusat bingkai maya, jadi posisi layarnya = fullW/2 - offsetX.
function variantShift({ W, H, fov, distance, targetX, targetY }) {
  // Bingkai maya dipilih seminimal mungkin: cukup besar untuk memuat jendela
  // dengan pusatnya di (targetX, targetY), tidak lebih. Dengan targetY = H/2
  // hasilnya fullH = H dan offsetY = 0, sehingga FOV vertikal tetap apa adanya.
  const fullW = 2 * Math.max(targetX, W - targetX);
  const fullH = 2 * Math.max(targetY, H - targetY);
  const offsetX = fullW / 2 - targetX;
  const offsetY = fullH / 2 - targetY;
  const cam = new PerspectiveCamera(fov, fullW / fullH, 0.1, 4000);
  cam.setViewOffset(fullW, fullH, offsetX, offsetY, W, H);
  place(cam, distance);
  return { ...silhouette(cam, W, H), fullW, fullH, offsetX, offsetY };
}

/** Cari jarak yang menghasilkan diameter siluet tertentu. */
function solveDistance(measure, targetDiameter) {
  let lo = 1.02;
  let hi = 40;
  for (let i = 0; i < 100; i += 1) {
    const mid = (lo + hi) / 2;
    if (measure(mid).w > targetDiameter) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const W = 1440;
const H = 900;
const TARGET_D = 1125; // ~125vh
const TARGET_X = 1440; // ~100vw
const TARGET_Y = 450;

console.log(`Target: diameter ${TARGET_D}px (${(TARGET_D / H * 100).toFixed(0)}vh), pusat ${TARGET_X}, ${TARGET_Y}\n`);

console.log("A. BIDIK MIRING — pusat dipaksa ke tepi kanan");
console.log("  FOV | jarak |  cx    |  cy    | lebar  | rasio elips");
for (const fov of [64, 50, 40, 30, 22]) {
  // aimX yang menaruh pusat di TARGET_X, dicari bersama jarak.
  let aimX = -1;
  let distance = 2;
  for (let round = 0; round < 30; round += 1) {
    distance = solveDistance((d) => variantAim({ W, H, fov, distance: d, aimX, aimY: 0 }), TARGET_D);
    let lo = -4, hi = 0;
    for (let i = 0; i < 70; i += 1) {
      const g = (lo + hi) / 2;
      if (variantAim({ W, H, fov, distance, aimX: g, aimY: 0 }).cx < TARGET_X) hi = g;
      else lo = g;
    }
    aimX = (lo + hi) / 2;
  }
  const s = variantAim({ W, H, fov, distance, aimX, aimY: 0 });
  console.log(`  ${String(fov).padStart(3)} | ${distance.toFixed(3).padStart(5)} | ${s.cx.toFixed(1).padStart(6)} | ${s.cy.toFixed(1).padStart(6)} | ${s.w.toFixed(1).padStart(6)} | ${s.rasio.toFixed(4)}`);
}

console.log("\nB. FRUSTUM ASIMETRIS — kamera tetap menatap planet");
console.log("  FOV | jarak |  cx    |  cy    | lebar  | rasio elips");
for (const fov of [64, 50, 40]) {
  const distance = solveDistance((d) => variantShift({ W, H, fov, distance: d, targetX: TARGET_X, targetY: TARGET_Y }), TARGET_D);
  const s = variantShift({ W, H, fov, distance, targetX: TARGET_X, targetY: TARGET_Y });
  console.log(`  ${String(fov).padStart(3)} | ${distance.toFixed(3).padStart(5)} | ${s.cx.toFixed(1).padStart(6)} | ${s.cy.toFixed(1).padStart(6)} | ${s.w.toFixed(1).padStart(6)} | ${s.rasio.toFixed(4)}`);
}

/* --- konfigurasi final yang dipilih --------------------------------------- */
console.log("\nC. KONFIGURASI FINAL (frustum asimetris, FOV 64)");
const fov = 64;
const dExp = solveDistance((d) => variantShift({ W, H, fov, distance: d, targetX: TARGET_X, targetY: TARGET_Y }), TARGET_D);
const s = variantShift({ W, H, fov, distance: dExp, targetX: TARGET_X, targetY: TARGET_Y });
const dArrival = 2.2;
console.log(`  jarak eksplorasi   : ${dExp.toFixed(4)}  (kedatangan ${dArrival})`);
console.log(`  skala jarak        : ${(dExp / dArrival).toFixed(4)}  -> PULL ${(dExp / dArrival - 1).toFixed(4)}`);
console.log(`  bingkai maya       : ${s.fullW} x ${s.fullH}, offset ${s.offsetX}, ${s.offsetY}`);
console.log(`  aspect kamera      : ${(s.fullW / s.fullH).toFixed(4)}`);
console.log();
console.log(`  pusat              : ${s.cx.toFixed(1)}, ${s.cy.toFixed(1)}`);
console.log(`  diameter           : ${s.w.toFixed(1)} px = ${(s.w / H * 100).toFixed(1)}vh = ${(s.w / W * 100).toFixed(1)}vw`);
console.log(`  rasio elips        : ${s.rasio.toFixed(4)}`);
console.log(`  limb kiri          : ${s.minX.toFixed(1)}`);
console.log(`  terpotong kanan    : ${(s.maxX - W).toFixed(1)} px`);
console.log(`  terpotong atas     : ${s.minY < 0 ? (-s.minY).toFixed(1) : "0"} px`);
console.log(`  terpotong bawah    : ${s.maxY > H ? (s.maxY - H).toFixed(1) : "0"} px`);
console.log(`  ruang kiri bersih  : ${s.minX.toFixed(0)} px = ${(s.minX / W * 100).toFixed(1)}% lebar`);
const visible = (() => {
  // Perkiraan bagian piringan yang masih di dalam viewport, dengan sampling grid.
  let inside = 0, total = 0;
  const r = s.w / 2;
  for (let y = s.cy - r; y <= s.cy + r; y += 4) {
    for (let x = s.cx - r; x <= s.cx + r; x += 4) {
      if ((x - s.cx) ** 2 + (y - s.cy) ** 2 > r * r) continue;
      total += 1;
      if (x >= 0 && x <= W && y >= 0 && y <= H) inside += 1;
    }
  }
  return (inside / total) * 100;
})();
console.log(`  piringan terlihat  : ${visible.toFixed(1)}%`);
