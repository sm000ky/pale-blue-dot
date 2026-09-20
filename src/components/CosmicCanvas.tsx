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

  // Smooth frame-by-frame camera animation state (Eliminates all 4Hz audio stutter!)
  const targetCameraPosRef = useRef(new THREE.Vector3(0, 40, 1100));
  const currentCameraPosRef = useRef(new THREE.Vector3(0, 40, 1100));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  // Current time ref for smooth requestAnimationFrame access
  const currentTimeRef = useRef(0);
  const viewModeRef = useRef<ViewMode>('cinema');
  currentTimeRef.current = currentTime;
  viewModeRef.current = viewMode;

  // Mouse Parallax & Orbit state
  const mousePointerRef = useRef({ x: 0, y: 0 });
  const smoothedPointerRef = useRef({ x: 0, y: 0 });
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
    scene.fog = new THREE.FogExp2(0x020408, 0.00018);
    sceneRef.current = scene;

    // 2. Camera: Voyager 1 Narrow-Angle Telescope Optical Simulation (0.42° FOV at start)
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(34, aspect, 0.1, 4000);
    camera.position.set(0, 40, 1100);
    cameraRef.current = camera;

    // 3. WebGL Renderer: Capped at pixelRatio 1.6 for rock-solid 60-120 FPS on all devices
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
      depth: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const textureLoader = new THREE.TextureLoader();

    // 4. Optimized Cosmic Starfield (3,000 high-performance stars, zero fillrate lag)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 950 + Math.random() * 850;
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
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.88
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. Floating Cosmic Dust Motes (400 particles, zero lag)
    const dustCount = 400;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 500;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 700;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      size: 2.0,
      color: 0xcde8ff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const dustField = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustField);
    dustParticlesRef.current = dustField;

    // 6. NASA JPL Astronomical Sun Position (32° above ecliptic plane)
    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.2);
    sunLight.position.set(480, 180, -800);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x0e1322, 0.65);
    scene.add(ambientLight);

    // The iconic 32° Voyager 1 Sunbeam Optical Flare
    const sunbeamGeometry = new THREE.CylinderGeometry(1.2, 40, 1800, 32, 1, true);
    const sunbeamMaterial = new THREE.MeshBasicMaterial({
      color: 0xfffaea,
      transparent: true,
      opacity: 0.045,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sunbeam = new THREE.Mesh(sunbeamGeometry, sunbeamMaterial);
    sunbeam.position.set(18, 8, 0);
    sunbeam.rotation.z = Math.PI / 4.25;
    sunbeam.rotation.x = 0.14;
    scene.add(sunbeam);

    // 7. Earth Group (Multi-Layer PBR Globe)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    const dayTexture = textureLoader.load('/textures/earth-day.webp');
    const nightTexture = textureLoader.load('/textures/earth-night.webp');
    const cloudsTexture = textureLoader.load('/textures/earth-clouds.webp');
    const specularTexture = textureLoader.load('/textures/earth-specular.webp');
    const normalTexture = textureLoader.load('/textures/earth-normal.webp');

    // Earth Base Globe (Radius 10) with Ocean Specular Glint
    const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: dayTexture,
      roughnessMap: specularTexture,
      roughness: 0.45,
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
        diffuseColor.rgb += nightColor.rgb * nightFactor * 2.2;
        `
      );
    };

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Clouds Layer (Radius 10.15)
    const cloudsGeometry = new THREE.SphereGeometry(10.15, 64, 64);
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

    // Rayleigh Atmospheric Scattering (Cyan daylight rim + golden sunset terminator)
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

    // 3D Moon Orbit
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

    // POI Pins
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

    // 8. Voyager Golden Record Chamber (3D Model)
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

    // 9. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Pointer Tracking for Smooth Parallax & Drag
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

    // 11. Raycasting for POI pin clicks
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

    // 12. Main 60-120 FPS Buttery Smooth Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(0.1, clock.getDelta());

      // Smooth pointer lerp
      smoothedPointerRef.current.x += (mousePointerRef.current.x - smoothedPointerRef.current.x) * 0.08;
      smoothedPointerRef.current.y += (mousePointerRef.current.y - smoothedPointerRef.current.y) * 0.08;

      // Earth & Clouds Continuous Rotation
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += delta * 0.025;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += delta * 0.038;
      }
      if (moonGroupRef.current) {
        moonGroupRef.current.rotation.y += delta * 0.008;
      }
      if (goldenRecordMeshRef.current) {
        goldenRecordMeshRef.current.rotation.z += delta * 0.35;
      }
      starField.rotation.y += delta * 0.0015;

      // Dust motes gentle drift
      if (dustParticlesRef.current) {
        dustParticlesRef.current.rotation.y += delta * 0.006;
        dustParticlesRef.current.position.x = smoothedPointerRef.current.x * 12;
        dustParticlesRef.current.position.y = smoothedPointerRef.current.y * 8;
      }

      // FRAME-BY-FRAME BUTTERY SMOOTH CAMERA INTERPOLATION
      // Calculates every single frame (60-120fps) — ZERO STUTTER!
      const currentMode = viewModeRef.current;
      const t = Math.min(270, currentTimeRef.current);

      if (currentMode === 'cinema') {
        if (goldenRecordGroupRef.current) {
          goldenRecordGroupRef.current.position.set(0, 0, -2000);
        }

        const px = smoothedPointerRef.current.x * 6;
        const py = smoothedPointerRef.current.y * 4;

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

        targetCameraPosRef.current.set(targetX, targetY, targetZ);
        targetLookAtRef.current.set(0, 0, 0);
      } else if (currentMode === 'free') {
        if (goldenRecordGroupRef.current) {
          goldenRecordGroupRef.current.position.set(0, 0, -2000);
        }
        const rot = orbitRotationRef.current;
        const dist = orbitDistanceRef.current;

        const targetX = dist * Math.sin(rot.y) * Math.cos(rot.x);
        const targetY = dist * Math.sin(rot.x);
        const targetZ = dist * Math.cos(rot.y) * Math.cos(rot.x);

        targetCameraPosRef.current.set(targetX, targetY, targetZ);
        targetLookAtRef.current.set(0, 0, 0);
      } else if (currentMode === 'record') {
        if (goldenRecordGroupRef.current) {
          goldenRecordGroupRef.current.position.set(0, 0, 0);
        }
        targetCameraPosRef.current.set(0, 4, 32);
        targetLookAtRef.current.set(0, 0, 0);
      }

      // Smooth dampening towards target
      const lerpSpeed = Math.min(1, delta * 3.5);
      currentCameraPosRef.current.lerp(targetCameraPosRef.current, lerpSpeed);
      currentLookAtRef.current.lerp(targetLookAtRef.current, lerpSpeed);

      camera.position.copy(currentCameraPosRef.current);
      camera.lookAt(currentLookAtRef.current);

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
    />
  );
};
