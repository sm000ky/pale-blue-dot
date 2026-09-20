import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type ViewMode = 'cinema' | 'free' | 'record';

interface CosmicCanvasProps {
  currentTime: number; // 0 to 270.5 seconds
  duration: number;
  viewMode: ViewMode;
  isPlaying: boolean;
  onEarthClick?: () => void;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
  currentTime,
  duration,
  viewMode,
  isPlaying,
  onEarthClick
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Three.js instances refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Mesh refs
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const sunbeamMeshRef = useRef<THREE.Mesh | null>(null);
  const goldenRecordGroupRef = useRef<THREE.Group | null>(null);
  const goldenRecordMeshRef = useRef<THREE.Mesh | null>(null);

  // Interaction / Orbit state for Free Orbit mode
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const orbitRotationRef = useRef({ x: 0.2, y: -0.5 });
  const orbitDistanceRef = useRef(35);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070c, 0.00035);
    sceneRef.current = scene;

    // 2. Camera (Narrow-angle lens simulation like Voyager 1 1500mm focal length)
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 4000);
    camera.position.set(0, 40, 1200); // Start far away at 40 AU
    cameraRef.current = camera;

    // 3. Renderer with high-DPI support
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // 5. Starfield (3,500 procedural stars)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 900 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      // Star colors: Ice Blue, Pale Gold, Diamond White
      const r = Math.random();
      if (r > 0.8) {
        starColors[i * 3] = 0.65;
        starColors[i * 3 + 1] = 0.82;
        starColors[i * 3 + 2] = 1.0; // Pale Blue
      } else if (r > 0.6) {
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.88;
        starColors[i * 3 + 2] = 0.65; // Pale Gold
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
      opacity: 0.85
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 6. The Distant Sun & Sunbeam Light
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    sunLight.position.set(400, 180, -700);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x161a28, 0.6);
    scene.add(ambientLight);

    // The iconic Voyager 1 diagonal Sunbeam streak
    const sunbeamGeometry = new THREE.CylinderGeometry(1.5, 35, 1600, 32, 1, true);
    const sunbeamMaterial = new THREE.MeshBasicMaterial({
      color: 0xfbf6e2,
      transparent: true,
      opacity: 0.045,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const sunbeam = new THREE.Mesh(sunbeamGeometry, sunbeamMaterial);
    sunbeam.position.set(20, 10, 0);
    sunbeam.rotation.z = Math.PI / 4.2;
    sunbeam.rotation.x = 0.15;
    scene.add(sunbeam);
    sunbeamMeshRef.current = sunbeam;

    // 7. Earth Group (Globe, Clouds, Atmosphere Rim)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    // Textures
    const dayTexture = textureLoader.load('/textures/earth-day.webp');
    const nightTexture = textureLoader.load('/textures/earth-night.webp');
    const cloudsTexture = textureLoader.load('/textures/earth-clouds.webp');
    const specularTexture = textureLoader.load('/textures/earth-specular.webp');
    const normalTexture = textureLoader.load('/textures/earth-normal.webp');

    // A. Earth Base Globe (10 units radius)
    const earthGeometry = new THREE.SphereGeometry(10, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: dayTexture,
      roughnessMap: specularTexture,
      roughness: 0.65,
      metalness: 0.1,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.35, 0.35)
    });

    // Custom shader hook for glowing city lights on night side
    earthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.nightTexture = { value: nightTexture };
      shader.uniforms.sunDirection = { value: new THREE.Vector3(400, 180, -700).normalize() };

      shader.fragmentShader = `
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        ${shader.fragmentShader}
      `;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `
        #include <map_fragment>
        // Calculate night side factor
        float NdotL = dot(vNormal, sunDirection);
        float nightFactor = smoothstep(0.15, -0.35, NdotL);
        vec4 nightColor = texture2D(nightTexture, vMapUv);
        // Add golden night lights to unlit areas
        diffuseColor.rgb += nightColor.rgb * nightFactor * 1.8;
        `
      );
    };

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // B. Clouds Layer (radius 10.15)
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

    // C. Atmospheric Fresnel Rim Glow (Glowing Cyan Horizon)
    const atmosphereGeometry = new THREE.SphereGeometry(10.35, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
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
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.8);
          vec3 glowColor = vec3(0.45, 0.78, 1.0); // Pale Cyan Blue
          gl_FragColor = vec4(glowColor, fresnel * 0.95);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphereMesh);
    atmosphereMeshRef.current = atmosphereMesh;

    // 8. Voyager Golden Record (3D Phonograph Disc)
    const goldenRecordGroup = new THREE.Group();
    goldenRecordGroup.position.set(0, 0, -500); // Placed at distance, brought into focus in 'record' mode
    scene.add(goldenRecordGroup);
    goldenRecordGroupRef.current = goldenRecordGroup;

    const recordFrontTexture = textureLoader.load('/archive/golden-record-front.webp');
    const recordCoverTexture = textureLoader.load('/archive/golden-record-cover.webp');

    const recordGeometry = new THREE.CylinderGeometry(11, 11, 0.35, 64);
    const recordMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xcca033, metalness: 0.9, roughness: 0.2 }), // rim
      new THREE.MeshStandardMaterial({ map: recordFrontTexture, metalness: 0.85, roughness: 0.25 }), // top
      new THREE.MeshStandardMaterial({ map: recordCoverTexture, metalness: 0.85, roughness: 0.25 })  // bottom
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

    // 10. Mouse/Touch interactions for Free Orbit
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      orbitRotationRef.current.y += deltaX * 0.006;
      orbitRotationRef.current.x = Math.max(-1.4, Math.min(1.4, orbitRotationRef.current.x + deltaY * 0.006));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      orbitDistanceRef.current = Math.max(14, Math.min(250, orbitDistanceRef.current + e.deltaY * 0.05));
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: true });

    // 11. Main Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Earth & Clouds slow rotational motion
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += delta * 0.03;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += delta * 0.042; // clouds swirl slightly faster
      }
      if (goldenRecordMeshRef.current) {
        goldenRecordMeshRef.current.rotation.z += delta * 0.4; // 33 1/3 RPM spin
      }
      starField.rotation.y += delta * 0.003;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Camera & Positions on currentTime or viewMode change
  useEffect(() => {
    const camera = cameraRef.current;
    const earthGroup = earthGroupRef.current;
    const goldenRecordGroup = goldenRecordGroupRef.current;
    if (!camera || !earthGroup || !goldenRecordGroup) return;

    if (viewMode === 'cinema') {
      // Hide Golden Record in cinema view
      goldenRecordGroup.position.set(0, 0, -2000);

      // CINEMATIC JOURNEY INTERPOLATION (0s to 270.5s):
      // 0s to 32s: Distance 40 AU (z = 1100 -> 950). Earth is a tiny pixel inside the sunbeam.
      // 33s to 98s: Hyperspace zoom across the solar system (z = 950 -> 350).
      // 99s to 172s: Majestic Earth orbit approach (z = 350 -> 90).
      // 173s to 236s: Night side rotation, revealing golden city lights (camera orbits to z = 50, x = 40).
      // 237s to 270s: Low-orbit cinematic sweep (z = 28, y = 8).

      const t = Math.min(270, currentTime);
      let targetX = 0;
      let targetY = 0;
      let targetZ = 1100;

      if (t < 32) {
        const progress = t / 32;
        targetZ = 1100 - progress * 150;
        targetY = 25 - progress * 10;
        targetX = 15 - progress * 5;
      } else if (t < 98) {
        const progress = (t - 32) / (98 - 32);
        targetZ = 950 - progress * 650; // 950 -> 300
        targetY = 15 - progress * 5;
        targetX = 10 - progress * 10;
      } else if (t < 172) {
        const progress = (t - 98) / (172 - 98);
        targetZ = 300 - progress * 210; // 300 -> 90
        targetY = 10 + Math.sin(progress * Math.PI) * 15;
        targetX = Math.sin(progress * Math.PI * 0.8) * 30;
      } else if (t < 236) {
        const progress = (t - 172) / (236 - 172);
        // Swing to night side of Earth
        targetZ = 90 - progress * 48; // 90 -> 42
        targetX = 30 + progress * 25; // 30 -> 55
        targetY = 10 - progress * 4;
      } else {
        const progress = (t - 236) / (270 - 236);
        targetZ = 42 - progress * 16; // 42 -> 26 (Very close orbit)
        targetX = 55 - progress * 40;
        targetY = 6 + Math.sin(progress * Math.PI) * 8;
      }

      // Smooth camera interpolation
      camera.position.x += (targetX - camera.position.x) * 0.08;
      camera.position.y += (targetY - camera.position.y) * 0.08;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);
    } else if (viewMode === 'free') {
      // Free orbit mode: camera is controlled by touch/mouse orbitRotation & orbitDistance
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
      // Golden Record Chamber view
      goldenRecordGroup.position.set(0, 0, 0);
      camera.position.set(0, 5, 34);
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
