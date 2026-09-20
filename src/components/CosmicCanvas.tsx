import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type ViewMode = 'cinema' | 'free' | 'record';

export interface PlanetPOI {
  id: string;
  name: string;
  jpName: string;
  lat: number;
  lon: number;
  description: string;
}

export const PLANET_POIS: PlanetPOI[] = [
  {
    id: 'tokyo',
    name: 'Metropolis of Lights',
    jpName: '光のメガロポリス (東京)',
    lat: 35.6762,
    lon: 139.6503,
    description: '38 million human souls flickering like golden embers against the vast obsidian sea.'
  },
  {
    id: 'himalayas',
    name: 'The Roof of the World',
    jpName: '世界の屋根 (ヒマラヤ)',
    lat: 27.9881,
    lon: 86.9250,
    description: 'Ancient sea beds lifted eight kilometers into the stratosphere by crashing tectonic plates.'
  },
  {
    id: 'sahara',
    name: 'The Golden Expanse',
    jpName: 'サハラ砂漠',
    lat: 23.4162,
    lon: 12.8628,
    description: 'A quiet ocean of golden sand where the sun burns uninterrupted over eons of silence.'
  },
  {
    id: 'amazon',
    name: 'The Living Canopy',
    jpName: 'アマゾンの密林',
    lat: -3.4653,
    lon: -62.2159,
    description: 'A breathing emerald mantle generating oxygen for billions of living creatures.'
  },
  {
    id: 'mariana',
    name: 'The Pacific Abyss',
    jpName: 'マリアナ海溝',
    lat: 11.3493,
    lon: 142.1995,
    description: 'Eleven kilometers of saltwater pressure, cloaked in eternal darkness since Earth formed.'
  }
];

interface CosmicCanvasProps {
  currentTime: number;
  duration: number;
  viewMode: ViewMode;
  isPlaying: boolean;
  selectedPoi: PlanetPOI | null;
  onSelectPoi: (poi: PlanetPOI | null) => void;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
  currentTime,
  duration,
  viewMode,
  isPlaying,
  selectedPoi,
  onSelectPoi
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const earthGroupRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const moonGroupRef = useRef<THREE.Group | null>(null);
  const goldenRecordGroupRef = useRef<THREE.Group | null>(null);
  const goldenRecordMeshRef = useRef<THREE.Mesh | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const poiPinsGroupRef = useRef<THREE.Group | null>(null);

  const mousePointerRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const previousPointerRef = useRef({ x: 0, y: 0 });
  const orbitRotationRef = useRef({ x: 0.25, y: -0.6 });
  const orbitDistanceRef = useRef(32);

  const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Deep Cosmic Atmosphere
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020408, 0.00022);
    sceneRef.current = scene;

    // 2. Camera with Narrow Telephoto Lens
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 4000);
    camera.position.set(0, 40, 1200);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-DPI & Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const textureLoader = new THREE.TextureLoader();

    // 4. Procedural Galactic Nebula Clouds (Volumetric Cosmic Glow)
    const nebulaCount = 600;
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaPositions = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount; i++) {
      const radius = 1000 + Math.random() * 600;
      const theta = (Math.random() - 0.5) * Math.PI * 1.8;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      nebulaPositions[i * 3] = radius * Math.cos(phi) * Math.sin(theta);
      nebulaPositions[i * 3 + 1] = radius * Math.sin(phi);
      nebulaPositions[i * 3 + 2] = -radius * Math.cos(phi) * Math.cos(theta);

      // Deep interstellar nebula colors: Deep Indigo, Violet & Cyan Dust
      const mix = Math.random();
      if (mix > 0.6) {
        nebulaColors[i * 3] = 0.15;
        nebulaColors[i * 3 + 1] = 0.35;
        nebulaColors[i * 3 + 2] = 0.65; // Cyan / Azure
      } else if (mix > 0.3) {
        nebulaColors[i * 3] = 0.35;
        nebulaColors[i * 3 + 1] = 0.12;
        nebulaColors[i * 3 + 2] = 0.55; // Cosmic Violet
      } else {
        nebulaColors[i * 3] = 0.08;
        nebulaColors[i * 3 + 1] = 0.15;
        nebulaColors[i * 3 + 2] = 0.35; // Deep Space Indigo
      }
    }
    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPositions, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
      size: 45,
      vertexColors: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const nebulaField = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebulaField);

    // 5. Starfield (4,500 Stars with Realistic Scintillation)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 4500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 950 + Math.random() * 900;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const r = Math.random();
      if (r > 0.8) {
        starColors[i * 3] = 0.7;
        starColors[i * 3 + 1] = 0.88;
        starColors[i * 3 + 2] = 1.0; // Pale Blue
      } else if (r > 0.6) {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.85;
        starColors[i * 3 + 2] = 0.6; // Pale Gold
      } else {
        starColors[i * 3] = 0.95;
        starColors[i * 3 + 1] = 0.95;
        starColors[i * 3 + 2] = 0.98; // White
      }
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 6. Foreground Floating Cosmic Dust Motes ("A Mote of Dust")
    const dustCount = 800;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 600;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 2.4,
      color: 0xcde8ff,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const dustField = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustField);
    dustParticlesRef.current = dustField;

    // 7. Blinding Distant Sun & God Ray Sunbeam
    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.2);
    sunLight.position.set(480, 180, -800);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x0e1322, 0.65);
    scene.add(ambientLight);

    // The iconic Voyager 1 diagonal Sunbeam streak with dual-layer glow
    const sunbeamGeometry = new THREE.CylinderGeometry(1.2, 44, 1800, 32, 1, true);
    const sunbeamMaterial = new THREE.MeshBasicMaterial({
      color: 0xfffaea,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sunbeam = new THREE.Mesh(sunbeamGeometry, sunbeamMaterial);
    sunbeam.position.set(18, 8, 0);
    sunbeam.rotation.z = Math.PI / 4.25;
    sunbeam.rotation.x = 0.14;
    scene.add(sunbeam);

    // 8. Earth Group
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    const dayTexture = textureLoader.load('/textures/earth-day.webp');
    const nightTexture = textureLoader.load('/textures/earth-night.webp');
    const cloudsTexture = textureLoader.load('/textures/earth-clouds.webp');
    const specularTexture = textureLoader.load('/textures/earth-specular.webp');
    const normalTexture = textureLoader.load('/textures/earth-normal.webp');

    // A. Earth Base Globe (Radius 10) with High-Gloss Ocean Specular
    const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: dayTexture,
      roughnessMap: specularTexture,
      roughness: 0.45, // Crisp ocean reflection
      metalness: 0.15,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.45, 0.45)
    });

    earthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.nightTexture = { value: nightTexture };
      shader.uniforms.sunDirection = { value: new THREE.Vector3(480, 180, -800).normalize() };

      shader.fragmentShader = `
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        ${shader.fragmentShader}
      `;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
        #include <map_fragment>
        float NdotL = dot(vNormal, sunDirection);
        float nightFactor = smoothstep(0.12, -0.38, NdotL);
        vec4 nightColor = texture2D(nightTexture, vMapUv);
        // Golden glowing night city lights
        diffuseColor.rgb += nightColor.rgb * nightFactor * 2.2;
        `
      );
    };

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // B. Clouds Layer with Depth (Radius 10.16)
    const cloudsGeometry = new THREE.SphereGeometry(10.16, 64, 64);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending,
      depthWrite: false
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    earthGroup.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // C. Rayleigh Atmospheric Scattering Glow (Sunset Amber Terminator + Cyan Rim)
    const atmosphereGeometry = new THREE.SphereGeometry(10.42, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunDirection: { value: new THREE.Vector3(480, 180, -800).normalize() }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 sunDirection;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.6);
          float NdotL = dot(vNormal, sunDirection);

          // Rayleigh scattering: Cyan on daylight rim, glowing amber/rose on sunset terminator!
          vec3 dayGlow = vec3(0.42, 0.78, 1.0);
          vec3 sunsetGlow = vec3(1.0, 0.55, 0.25);
          float sunsetFactor = smoothstep(-0.25, 0.25, NdotL) * (1.0 - smoothstep(0.2, 0.8, NdotL));

          vec3 finalGlow = mix(dayGlow, sunsetGlow, sunsetFactor * 0.85);
          gl_FragColor = vec4(finalGlow, fresnel * (0.4 + max(0.0, NdotL) * 0.6) * 1.1);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphereMesh);

    // D. The Orbiting 3D Moon
    const moonGroup = new THREE.Group();
    earthGroup.add(moonGroup);
    moonGroupRef.current = moonGroup;

    const moonGeometry = new THREE.SphereGeometry(2.7, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.9,
      metalness: 0.05
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.set(65, 12, -20);
    moonGroup.add(moonMesh);

    // E. POI Pins Group
    const poiPinsGroup = new THREE.Group();
    earthMesh.add(poiPinsGroup);
    poiPinsGroupRef.current = poiPinsGroup;

    PLANET_POIS.forEach((poi) => {
      const pos = latLonToVector3(poi.lat, poi.lon, 10.25);
      const pinGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x89cff0 });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      pin.userData = { poi };

      const ringGeo = new THREE.RingGeometry(0.25, 0.45, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x89cff0,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      pin.add(ring);

      poiPinsGroup.add(pin);
    });

    // 9. Voyager Golden Record Chamber (3D Model)
    const goldenRecordGroup = new THREE.Group();
    goldenRecordGroup.position.set(0, 0, -2000);
    scene.add(goldenRecordGroup);
    goldenRecordGroupRef.current = goldenRecordGroup;

    const recordFrontTexture = textureLoader.load('/archive/golden-record-front.webp');
    const recordCoverTexture = textureLoader.load('/archive/golden-record-cover.webp');

    const recordGeometry = new THREE.CylinderGeometry(11, 11, 0.35, 64);
    const recordMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xcca033, metalness: 0.95, roughness: 0.18 }),
      new THREE.MeshStandardMaterial({ map: recordFrontTexture, metalness: 0.88, roughness: 0.22 }),
      new THREE.MeshStandardMaterial({ map: recordCoverTexture, metalness: 0.88, roughness: 0.22 })
    ];
    const goldenRecordMesh = new THREE.Mesh(recordGeometry, recordMaterials);
    goldenRecordMesh.rotation.x = Math.PI / 2;
    goldenRecordGroup.add(goldenRecordMesh);
    goldenRecordMeshRef.current = goldenRecordMesh;

    // 10. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 11. Pointer Tracking for Parallax & Orbit Drag
    const handlePointerMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mousePointerRef.current.x = (e.clientX / w) * 2 - 1;
      mousePointerRef.current.y = -(e.clientY / h) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousPointerRef.current.x;
        const deltaY = e.clientY - previousPointerRef.current.y;
        orbitRotationRef.current.y += deltaX * 0.005;
        orbitRotationRef.current.x = Math.max(-1.4, Math.min(1.4, orbitRotationRef.current.x + deltaY * 0.005));
        previousPointerRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      previousPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      orbitDistanceRef.current = Math.max(14, Math.min(200, orbitDistanceRef.current + e.deltaY * 0.04));
    };

    window.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: true });

    // 12. Raycasting for POI pin clicks
    const raycaster = new THREE.Raycaster();
    const handleCanvasClick = (e: MouseEvent) => {
      if (!camera || !poiPinsGroupRef.current) return;
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(poiPinsGroupRef.current.children, true);
      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.poi) {
          obj = obj.parent;
        }
        if (obj?.userData?.poi) {
          onSelectPoi(obj.userData.poi);
        }
      }
    };
    container.addEventListener('click', handleCanvasClick);

    // 13. Main Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Earth & Clouds Rotation
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += delta * 0.025;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += delta * 0.038;
      }
      if (moonGroupRef.current) {
        moonGroupRef.current.rotation.y += delta * 0.008; // Moon orbits Earth
      }
      if (goldenRecordMeshRef.current) {
        goldenRecordMeshRef.current.rotation.z += delta * 0.35;
      }
      starField.rotation.y += delta * 0.0015;
      nebulaField.rotation.y -= delta * 0.001;

      // Dust motes gentle drift
      if (dustParticlesRef.current) {
        dustParticlesRef.current.rotation.y += delta * 0.006;
        dustParticlesRef.current.position.x = mousePointerRef.current.x * 12;
        dustParticlesRef.current.position.y = mousePointerRef.current.y * 8;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleCanvasClick);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Camera Interpolation & Modes
  useEffect(() => {
    const camera = cameraRef.current;
    const goldenRecordGroup = goldenRecordGroupRef.current;
    if (!camera || !goldenRecordGroup) return;

    if (viewMode === 'cinema') {
      goldenRecordGroup.position.set(0, 0, -2000);

      const px = mousePointerRef.current.x * 6;
      const py = mousePointerRef.current.y * 4;

      const t = Math.min(270, currentTime);
      let targetX = px;
      let targetY = py;
      let targetZ = 1100;

      if (t < 32) {
        const progress = t / 32;
        targetZ = 1100 - progress * 150;
        targetY = 25 - progress * 10 + py;
        targetX = 15 - progress * 5 + px;
      } else if (t < 98) {
        const progress = (t - 32) / (98 - 32);
        targetZ = 950 - progress * 650;
        targetY = 15 - progress * 5 + py;
        targetX = 10 - progress * 10 + px;
      } else if (t < 172) {
        const progress = (t - 98) / (172 - 98);
        targetZ = 300 - progress * 210;
        targetY = 10 + Math.sin(progress * Math.PI) * 12 + py;
        targetX = Math.sin(progress * Math.PI * 0.8) * 28 + px;
      } else if (t < 236) {
        const progress = (t - 172) / (236 - 172);
        targetZ = 90 - progress * 48;
        targetX = 30 + progress * 25 + px;
        targetY = 10 - progress * 4 + py;
      } else {
        const progress = (t - 236) / (270 - 236);
        targetZ = 42 - progress * 16;
        targetX = 55 - progress * 40 + px;
        targetY = 6 + Math.sin(progress * Math.PI) * 6 + py;
      }

      camera.position.x += (targetX - camera.position.x) * 0.08;
      camera.position.y += (targetY - camera.position.y) * 0.08;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);
    } else if (viewMode === 'free') {
      goldenRecordGroup.position.set(0, 0, -2000);
      const rot = orbitRotationRef.current;
      const dist = orbitDistanceRef.current;

      const targetX = dist * Math.sin(rot.y) * Math.cos(rot.x);
      const targetY = dist * Math.sin(rot.x);
      const targetZ = dist * Math.cos(rot.y) * Math.cos(rot.x);

      camera.position.x += (targetX - camera.position.x) * 0.1;
      camera.position.y += (targetY - camera.position.y) * 0.1;
      camera.position.z += (targetZ - camera.position.z) * 0.1;
      camera.lookAt(0, 0, 0);
    } else if (viewMode === 'record') {
      goldenRecordGroup.position.set(0, 0, 0);
      camera.position.set(0, 4, 32);
      camera.lookAt(0, 0, 0);
    }
  }, [currentTime, viewMode]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
    />
  );
};
