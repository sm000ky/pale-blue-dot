// Verifikasi getDotScreenPosition(): ukuran & posisi Bumi di layar sepanjang t.
//
// Konstanta DIBACA dari src/lib/three/earth-scene.ts, bukan disalin, supaya angka di
// tabel ini tidak bisa diam-diam berbeda dari koreografi yang benar-benar dipakai.
// Penempatan kamera direplikasi persis seperti applyJourney, lalu diproyeksikan dengan
// PerspectiveCamera three yang sama seperti di browser.
import { readFileSync } from "node:fs";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";

const src = readFileSync("src/lib/three/earth-scene.ts", "utf8");

const num = (name) => {
  const m = src.match(new RegExp(`^const ${name} = (-?[\\d.]+)$`, "m"));
  if (!m) throw new Error(`konstanta ${name} tidak ditemukan di earth-scene.ts`);
  return Number(m[1]);
};
const window2 = (name) => {
  const m = src.match(new RegExp(`^const ${name}: FadeWindow = \\[([-\\d.]+), ([-\\d.]+)\\]`, "m"));
  if (!m) throw new Error(`window ${name} tidak ditemukan`);
  return [Number(m[1]), Number(m[2])];
};

const EARTH_RADIUS = num("EARTH_RADIUS");
const FOV = num("FOV");
const NEAR_PLANE = num("NEAR_PLANE");
const FAR_PLANE = num("FAR_PLANE");
const RADIUS_NEAR = num("RADIUS_NEAR");
const FAR_DOT_PIXELS = num("FAR_DOT_PIXELS");
const REFERENCE_VIEWPORT_HEIGHT = num("REFERENCE_VIEWPORT_HEIGHT");
const EASE_SOFTNESS = num("EASE_SOFTNESS");
const REFERENCE_ASPECT = num("REFERENCE_ASPECT");
const AZIMUTH_FAR = num("AZIMUTH_FAR");
const AZIMUTH_NEAR = num("AZIMUTH_NEAR");
const ELEVATION_FAR = num("ELEVATION_FAR");
const ELEVATION_NEAR = num("ELEVATION_NEAR");
const FAR_OFFSET_X = num("FAR_OFFSET_X");
const FAR_OFFSET_Y = num("FAR_OFFSET_Y");
const FADE_OFFSET = window2("FADE_OFFSET");

const ANGLE_NEAR = 2 * Math.atan(EARTH_RADIUS / RADIUS_NEAR);
const ANGLE_FAR =
  2 *
  Math.atan(
    (FAR_DOT_PIXELS / REFERENCE_VIEWPORT_HEIGHT) * Math.tan((FOV * MathUtils.DEG2RAD) / 2),
  );

const WIDTH = 1440;
const HEIGHT = 900;

const camera = new PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR_PLANE, FAR_PLANE);
camera.updateProjectionMatrix();

const tmp = new Vector3();

// Salinan applyJourney: sumber posisi kamera.
function placeCamera(t) {
  const eased = MathUtils.lerp(t, MathUtils.smootherstep(t, 0, 1), EASE_SOFTNESS);
  const angularSize = Math.exp(MathUtils.lerp(Math.log(ANGLE_FAR), Math.log(ANGLE_NEAR), eased));
  const baseRadius = EARTH_RADIUS / Math.tan(angularSize / 2);
  const portraitFit = Math.max(1, REFERENCE_ASPECT / camera.aspect);
  const radius = baseRadius * (1 + (portraitFit - 1) * eased);

  const azimuth = MathUtils.lerp(AZIMUTH_FAR, AZIMUTH_NEAR, eased);
  const elevation = MathUtils.lerp(ELEVATION_FAR, ELEVATION_NEAR, eased);
  const cosElevation = Math.cos(elevation);

  camera.position.set(
    radius * cosElevation * Math.sin(azimuth),
    radius * Math.sin(elevation),
    radius * cosElevation * Math.cos(azimuth),
  );
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);

  const offsetAmount = 1 - MathUtils.smootherstep(t, FADE_OFFSET[0], FADE_OFFSET[1]);
  if (offsetAmount > 0.001) {
    const tanHalfFov = Math.tan(MathUtils.degToRad(FOV) / 2);
    const right = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
    const up = new Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    const target = new Vector3(0, 0, 0)
      .addScaledVector(right, -FAR_OFFSET_X * offsetAmount * radius * tanHalfFov * camera.aspect)
      .addScaledVector(up, -FAR_OFFSET_Y * offsetAmount * radius * tanHalfFov);
    camera.lookAt(target);
    camera.updateMatrixWorld(true);
  }
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
}

// Salinan getDotScreenPosition.
function dotScreenPosition() {
  const ndc = tmp.set(0, 0, 0).project(camera);
  const distance = camera.position.length();
  const tanHalfApparent = EARTH_RADIUS / distance;
  const tanHalfFov = Math.tan(camera.fov * MathUtils.DEG2RAD * 0.5);
  const radiusPx = (HEIGHT / 2) * (tanHalfApparent / tanHalfFov);
  return {
    x: (ndc.x * 0.5 + 0.5) * WIDTH,
    y: (0.5 - ndc.y * 0.5) * HEIGHT,
    radiusPx,
    onScreen: ndc.x >= -1 && ndc.x <= 1 && ndc.y >= -1 && ndc.y <= 1 && ndc.z >= -1 && ndc.z <= 1,
  };
}

// Target diameter dari brief (px pada viewport 900 tinggi). null = tidak dipatok.
const EXPECTED_DIAMETER = { 0: 2, 0.1: 3, 0.2: 4.9, 0.3: 8.8, 0.5: 35, 0.7: 140, 1: 655 };

const pad = (v, n, d = 2) => Number(v).toFixed(d).padStart(n);

console.log(`Canvas ${WIDTH}x${HEIGHT} CSS px, FOV ${FOV}, aspect ${(WIDTH / HEIGHT).toFixed(3)}\n`);
console.log("    t   jarak(R⊕)   radiusPx   diameterPx   target   selisih   x px    y px   onScreen");
console.log("  ----------------------------------------------------------------------------------");

let worst = 0;
for (const t of [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1.0]) {
  placeCamera(t);
  const p = dotScreenPosition();
  const diameter = p.radiusPx * 2;
  const target = EXPECTED_DIAMETER[t];
  const relative = Math.abs(diameter - target) / target;
  worst = Math.max(worst, relative);
  console.log(
    `  ${pad(t, 3, 1)}  ${pad(camera.position.length(), 9, 2)}  ` +
      `${pad(p.radiusPx, 9, 3)}  ${pad(diameter, 10, 3)}  ${pad(target, 7, 1)}  ` +
      `${pad(relative * 100, 6, 1)}%  ${pad(p.x, 6, 1)}  ${pad(p.y, 6, 1)}   ${p.onScreen}`,
  );
}

console.log(`\n  selisih relatif terbesar terhadap tabel brief: ${(worst * 100).toFixed(1)}%`);

// t = 0 harus mendarat tepat 2 px pada viewport referensi (900), berapa pun lebarnya.
placeCamera(0);
const atZero = dotScreenPosition();
console.log(
  `  t=0 pada tinggi ${REFERENCE_VIEWPORT_HEIGHT}: diameter ${(atZero.radiusPx * 2).toFixed(6)} px ` +
    `(FAR_DOT_PIXELS = ${FAR_DOT_PIXELS})`,
);

// Silang-uji: radiusPx harus sama dengan proyeksi titik pinggir piringan yang diukur
// tegak lurus sumbu pandang, memakai konvensi atan(R/d) yang dipakai koreografi.
placeCamera(0.5);
const analytic = dotScreenPosition().radiusPx;
const forward = new Vector3(0, 0, 0).sub(camera.position).normalize();
const side = new Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
const centreNdc = new Vector3(0, 0, 0).project(camera);
const edgeNdc = forward
  .clone()
  .multiplyScalar(camera.position.length())
  .add(camera.position)
  .addScaledVector(side, EARTH_RADIUS)
  .project(camera);
const measured = Math.abs((edgeNdc.y - centreNdc.y) * (HEIGHT / 2)) ||
  Math.abs((edgeNdc.x - centreNdc.x) * (WIDTH / 2));
console.log(
  `  silang-uji t=0.5: analitik ${analytic.toFixed(4)} px vs proyeksi titik pinggir ` +
    `${measured.toFixed(4)} px`,
);
