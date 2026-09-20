/**
 * earth-scene.ts — the visual core of "Pale Blue Dot".
 *
 * One WebGL scene has to carry the whole narrative, and it runs in the direction of the
 * journey home. It opens at Voyager 1's vantage of 14 February 1990 — ~6.06 billion
 * kilometres out, Earth a two-pixel mote of pale blue caught inside a band of scattered
 * sunlight — and closes in until the planet fills the frame. Once it has arrived,
 * nothing moves but the spin.
 *
 * Textures: Solar System Scope (CC BY 4.0).
 */

import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  ClampToEdgeWrapping,
  Color,
  type ColorSpace,
  DirectionalLight,
  Group,
  LinearFilter,
  LinearMipmapLinearFilter,
  type Material,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  NoColorSpace,
  type Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
  Timer,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

export type EarthSceneOptions = {
  canvas: HTMLCanvasElement
  onLoadProgress?: (fraction: number) => void
  onReady?: () => void
}

/**
 * Where the Earth actually is on screen right now — what an annotation has to follow.
 * A fixed percentage is only true at t = 0; past that the camera both closes in and
 * swings the aim point back to centre, so the dot moves and grows under the label.
 */
export type DotScreenPosition = {
  /** Centre of the Earth in CSS pixels, relative to the top-left of the canvas. */
  x: number
  y: number
  /** Apparent radius of the Earth in CSS pixels. ~1 at t = 0 (a two-pixel dot). */
  radiusPx: number
  /** false when the Earth's centre lies outside the frustum. */
  onScreen: boolean
}

/* ------------------------------------------------------------------ constants */

const EARTH_RADIUS = 1
const CLOUD_RADIUS = 1.006
const ATMOSPHERE_RADIUS = 1.025

/**
 * Vertical field of view. Wide enough that at RADIUS_NEAR the ~49-degree disc fills
 * most of the frame height with the limb and its atmosphere still inside it.
 */
const FOV = 64
const NEAR_PLANE = 0.05
/** Clears the star shell at its most-scaled size (~2400 units, reached at t = 0). */
const FAR_PLANE = 3000

/* ==================================================================================
 * JOURNEY CHOREOGRAPHY — every tunable of the approach lives in this block.
 *
 * The camera travels INWARD. t = 0 is Voyager's vantage: Earth is a two-pixel mote
 * inside a band of scattered sunlight. t = 1 is the arrival: Earth fills the frame.
 * Nothing below moves the camera once t reaches 1.
 *
 * The path is parameterised by APPARENT ANGULAR SIZE, not by distance. Interpolating
 * distance — even in log space — does not give an even growth on screen, because size
 * relates to distance through an arctangent: the previous build measured 95% of its
 * visible change inside 30% of the timeline and the eye read that as a jump. Here the
 * ANGLE is interpolated in log space and the distance is solved back out of it, so
 * every equal slice of the timeline multiplies the disc by very nearly the same
 * factor (~1.8x per 10% of the journey).
 * ================================================================================== */

/** Camera distance at the arrival, in Earth radii. Disc ~49 degrees across. */
const RADIUS_NEAR = 2.2
/** Diameter of the dot at t = 0, in CSS pixels on a viewport this tall. */
const FAR_DOT_PIXELS = 2
const REFERENCE_VIEWPORT_HEIGHT = 900

/**
 * Apparent diameter of Earth at each end of the journey, in radians. The far one is
 * solved from the pixel target through the perspective projection itself — a viewport
 * maps tan(angle/2), not the angle, so a linear reading of FOV would land ~10% off.
 */
const ANGLE_NEAR = 2 * Math.atan(EARTH_RADIUS / RADIUS_NEAR)
const ANGLE_FAR =
  2 *
  Math.atan(
    (FAR_DOT_PIXELS / REFERENCE_VIEWPORT_HEIGHT) * Math.tan((FOV * MathUtils.DEG2RAD) / 2),
  )
/** ~720 Earth radii. Derived, so retuning the dot size cannot desync the two ends. */
const RADIUS_FAR = EARTH_RADIUS / Math.tan(ANGLE_FAR / 2)

/**
 * 0 = mathematically constant growth (starts and stops abruptly); 1 = full
 * smootherstep, which softens both ends but surges through the middle — 2.85x per
 * slice against 1.05x at the ends, a milder form of the very fault this curve exists
 * to remove. 0.3 keeps every 10% slice inside 1.52x..2.04x while still easing away
 * from the dot and settling into the arrival.
 */
const EASE_SOFTNESS = 0.3

/**
 * Below this aspect the ARRIVAL is pushed back proportionally. FOV is vertical, so a
 * portrait phone sees far less horizontally at the same distance and the closing frame
 * becomes a wall of ocean with no limb anywhere. The compensation is zero at the far
 * end, so the opening dot is framed identically everywhere.
 */
const REFERENCE_ASPECT = 1

/**
 * The camera swings back toward the sun as it closes in: the crescent that the dot
 * shows from Voyager's angle opens into a lit disc by the time we arrive.
 */
const AZIMUTH_FAR = -0.77
const AZIMUTH_NEAR = 0.18
const ELEVATION_FAR = 0.05
const ELEVATION_NEAR = 0.15

/**
 * Where Earth sits in NDC at t = 0. The Voyager plate is not centred; the dot is off to
 * one side inside its band, and that asymmetry is most of why it reads as an accident
 * of an instrument rather than as a poster. It decays to a centred arrival.
 *
 * Far enough off-axis to clear the play control in the middle of the opening frame:
 * measured at 390x844 the dot lands ~90px from a ring of radius ~65.
 */
const FAR_OFFSET_X = 0.46
const FAR_OFFSET_Y = 0.2

/* ==================================================================================
 * COMPOSITION — the framing that outlives the journey.
 *
 * The journey owns the camera from the dot to the arrival and stops there. What
 * comes after the reading is a different question — where the planet sits while
 * something else has the floor — and it needs its own control, because it has to
 * be able to move while the journey stays exactly where it finished.
 *
 * The framing is done with an ASYMMETRIC FRUSTUM, not by aiming the camera away.
 * That distinction is the whole design. Perspective projects a sphere as an
 * ELLIPSE the moment its centre leaves the optical axis, and the stretch grows
 * with both the off-axis angle and the width of the lens. Measured against the
 * real silhouette (`tools/solve-composition.mjs` projects the tangent circle
 * rather than trusting an angular radius, which reports one number and always
 * looks healthy), putting the planet at the right edge by aiming away gives:
 *
 *   aiming away, 64 degrees -> ratio 1.315
 *   aiming away, 22 degrees -> ratio 1.045
 *   shifted frustum, any FOV -> ratio 1.0000
 *
 * Shifting the frustum keeps the camera pointed straight at the planet and moves
 * the WINDOW instead, so the disc stays a perfect circle however far it travels.
 * It is the principle of a shift lens. It also means the lens itself never has to
 * change: FOV stays at its natural 64 degrees.
 * ================================================================================== */

/**
 * Where the planet's centre sits at composition = 1, as a fraction of the canvas.
 *
 * Two framings, one rule, chosen by the shape of the viewport rather than by a
 * breakpoint in pixels: a landscape screen has room beside the planet, a portrait
 * screen only has room above it.
 *
 * Landscape places the centre ON the right edge — half the globe is outside the
 * frame — which is what makes it read as monumental rather than as a decoration
 * sitting in a corner. Portrait drops it to the lower edge for the same reason.
 */
const COMPOSITION_LANDSCAPE = { x: 1.0, y: 0.5 } as const
const COMPOSITION_PORTRAIT = { x: 0.5, y: 0.94 } as const

/**
 * Distance multiplier at composition = 1, against the arrival's own radius.
 *
 * Below 1: the camera closes in. The exploration frame is nearer than the
 * arrival, not further — the planet has to grow past the height of the frame to
 * feel close and heavy. Solved from the target silhouette diameter of 125vh:
 * 1.6245 against the arrival's 2.2.
 */
const COMPOSITION_DISTANCE_SCALE = 0.7384

/** [start, end] of a smootherstep window measured in journey units. */
type FadeWindow = readonly [start: number, end: number]

/**
 * The fade-in. Each window is a smootherstep over t, and the windows overlap so no
 * element switches on while another is still moving. None of these is a threshold, so
 * none of them can pop.
 */
const FADE_DOT_COLOR: FadeWindow = [0.04, 0.42] // far-dot tint -> the real texture
const FADE_BEAM_OUT: FadeWindow = [0.06, 0.52] // scattered-light bands -> gone
const FADE_STARS_IN: FadeWindow = [0.02, 0.45] // sky opens as the bands leave
const FADE_STARS_WASH: FadeWindow = [0.52, 1] // a lit Earth washes the sky back out
const FADE_ATMOSPHERE: FadeWindow = [0.34, 0.86]
const FADE_CLOUDS: FadeWindow = [0.4, 0.9]
const FADE_OFFSET: FadeWindow = [0, 0.66] // off-centre dot -> centred arrival
const FADE_EXPOSURE: FadeWindow = [0.05, 0.85]

/** Sky brightness at the dot, at its most open mid-journey, and at the arrival. */
const STAR_OPACITY_FAR = 0.16
const STAR_OPACITY_OPEN = 0.9
const STAR_OPACITY_ARRIVED = 0.3
/** Cloud shell opacity once the approach has fully revealed it. */
const CLOUD_OPACITY = 0.78
/** Tone-mapping exposure at each end: the frame lifts out of the dark as we close in. */
const EXPOSURE_FAR = 0.82
const EXPOSURE_NEAR = 1.05

/** Single source of truth for the sun. The light and every shader read from it. */
const SUN_DIRECTION = new Vector3(1, 0.15, 0.35).normalize()
const SUN_COLOR = 0xfff3e4
const SUN_INTENSITY = 1.45
const AMBIENT_COLOR = 0x2a3648
const AMBIENT_INTENSITY = 0.085

const PALE_BLUE = 0xa3c1e0
const SUNBEAM = 0xc8a678
const VOID_COLOR = 0x05070c

/**
 * Colour of the disc once it is only a few pixels wide, given as linear working-space
 * components rather than a hex token. The sunbeam is additive and warm: measured at
 * the opening frame, feeding --pale-blue straight through pushes the composite to
 * 255,255,255 and the dot turns white. A deeper, more saturated blue survives the
 * warm light on top of it and still lands as pale blue on screen.
 */
const FAR_DOT_R = 0.1
const FAR_DOT_G = 0.26
const FAR_DOT_B = 0.5

/** One rotation every ~180s. Slow enough to be felt rather than watched. */
const EARTH_SPIN = 0.035
const CLOUD_SPIN_FACTOR = 1.35
/**
 * Starting phase of the spin. The face that greets the arrival is this plus whatever
 * the spin has accumulated by then, so it is a seed rather than a framing: the Earth
 * turns throughout, including while it is still a dot.
 */
const INITIAL_SPIN = -1.15
const AXIAL_TILT = 23.44 * MathUtils.DEG2RAD

const STAR_COUNT = 4000
const STAR_SHELL_MIN = 200
const STAR_SHELL_MAX = 400
const STAR_SEED = 0x5a6a4e

/** Diagonal of the scattered-light bands, following the Voyager plate. */
const BAND_ANGLE = 0.42
/** Distance in front of the camera at which the scattered-light quad is parked. */
const BEAM_PLANE_DISTANCE = 1
/** Peak beam brightness. Above ~0.7 the additive band swallows the dot inside it. */
const BEAM_INTENSITY = 0.62

/** Draw order: stars (0) -> earth (opaque) -> clouds -> atmosphere -> beam. */
const ORDER_CLOUDS = 1
const ORDER_ATMOSPHERE = 2
const ORDER_BEAM = 10

type TextureKey = 'day' | 'night' | 'clouds' | 'specular' | 'normal'
type TextureSet = Record<TextureKey, Texture>

const TEXTURE_SPECS: ReadonlyArray<{ key: TextureKey; url: string; colorSpace: ColorSpace }> = [
  { key: 'day', url: '/textures/earth-day.webp', colorSpace: SRGBColorSpace },
  { key: 'night', url: '/textures/earth-night.webp', colorSpace: SRGBColorSpace },
  // Masks and vectors, not colour: an sRGB decode would bend the ocean mask and the
  // normals into wrong values, and three warns when an alphaMap claims to be sRGB.
  { key: 'clouds', url: '/textures/earth-clouds.webp', colorSpace: NoColorSpace },
  { key: 'specular', url: '/textures/earth-specular.webp', colorSpace: NoColorSpace },
  { key: 'normal', url: '/textures/earth-normal.webp', colorSpace: NoColorSpace },
]

/* ------------------------------------------------------------ uniform typing */

type Uniform<T> = { value: T }

type EarthUniforms = {
  uDayMap: Uniform<Texture>
  uNightMap: Uniform<Texture>
  uSpecularMap: Uniform<Texture>
  uNormalMap: Uniform<Texture>
  uSunDirection: Uniform<Vector3>
  uSunColor: Uniform<Color>
  uPaleBlue: Uniform<Color>
  uFarDot: Uniform<Color>
  uNormalScale: Uniform<number>
  uTerminator: Uniform<number>
  uDistanceFade: Uniform<number>
}

type AtmosphereUniforms = {
  uColor: Uniform<Color>
  uSunDirection: Uniform<Vector3>
  uOpacity: Uniform<number>
  uFresnelMax: Uniform<number>
}

type StarUniforms = {
  uPixelRatio: Uniform<number>
  uOpacity: Uniform<number>
}

type BeamUniforms = {
  uColor: Uniform<Color>
  uEarthNdc: Uniform<Vector2>
  uBandNormal: Uniform<Vector2>
  uAspect: Uniform<number>
  uIntensity: Uniform<number>
}

/* -------------------------------------------------------------------- helpers */

/**
 * mulberry32 — small, fast, deterministic. The star field must be identical on every
 * load; Math.random() would reshuffle the sky between reloads and screenshots.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** smootherstep over a named window — every transition of the fade-in goes through it. */
function fade(t: number, window: FadeWindow): number {
  return MathUtils.smootherstep(t, window[0], window[1])
}

function disposeMaterial(material: Material | Material[]): void {
  if (Array.isArray(material)) {
    for (const item of material) item.dispose()
  } else {
    material.dispose()
  }
}

/* --------------------------------------------------------------------- shaders */

const EARTH_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vTangentW;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;

    // Analytic tangent frame for a UV sphere: increasing u runs east, so
    // cross(spinAxis, normal) is exactly the tangent the normal map expects.
    // Cheaper and cleaner than baking tangent attributes into the geometry.
    vec3 tangent = normalize(cross(vec3(0.0, 1.0, 0.0), normal));

    mat3 m = mat3(modelMatrix);
    vNormalW = normalize(m * normal);
    vTangentW = normalize(m * tangent);

    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const EARTH_FRAGMENT = /* glsl */ `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform sampler2D uSpecularMap;
  uniform sampler2D uNormalMap;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uPaleBlue;
  uniform vec3 uFarDot;
  uniform float uNormalScale;
  uniform float uTerminator;
  uniform float uDistanceFade;

  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vTangentW;
  varying vec3 vWorldPos;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 T = normalize(vTangentW - N * dot(N, vTangentW)); // re-orthogonalise after interpolation
    vec3 B = cross(N, T);

    vec3 nTex = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
    nTex.xy *= uNormalScale;
    vec3 Nm = normalize(mat3(T, B, N) * nTex);

    vec3 L = normalize(uSunDirection);
    vec3 V = normalize(cameraPosition - vWorldPos);

    // The day/night blend runs off the GEOMETRIC normal, never the mapped one: relief
    // perturbation along the terminator would punch speckled holes of daylight into
    // the night side and scatter city lights back into daylight. smoothstep rather
    // than step because a real terminator is a band, not a line.
    float sun = dot(N, L);
    float dayMix = smoothstep(-uTerminator, uTerminator, sun);

    vec3 dayTex = texture2D(uDayMap, vUv).rgb;
    vec3 nightTex = texture2D(uNightMap, vUv).rgb;

    // Relief shading is the one place the mapped normal belongs.
    float diffuse = clamp(dot(Nm, L), 0.0, 1.0);
    vec3 day = dayTex * uSunColor * diffuse;

    // City lights survive only where the sun has left.
    vec3 night = nightTex * (1.0 - dayMix);

    // Verified against the asset: white = water, black = land.
    float ocean = texture2D(uSpecularMap, vUv).r;
    vec3 H = normalize(L + V);
    // A high exponent on purpose: sun glint off water is a small hard highlight.
    // Anything under a few hundred spreads into a blown-out blob the size of an ocean.
    float spec = pow(clamp(dot(Nm, H), 0.0, 1.0), 700.0);
    vec3 specular = uSunColor * spec * ocean * dayMix * 0.6;

    // Airglow lying on the disc itself. The atmosphere shell only covers the annulus
    // outside the silhouette, so without this the limb shows a seam.
    float rim = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.2);
    vec3 limb = uPaleBlue * rim * clamp(sun + 0.12, 0.0, 1.0) * 0.55;

    vec3 color = mix(night, day, dayMix) + specular + limb;
    color += dayTex * 0.014; // faint fill so the night ocean is dark, not void

    // At 40 AU the disc is a few pixels across and every sample lands on a high mip
    // level, where the average of a whole hemisphere is a muddy grey-brown. Bias the
    // surviving signal toward the colour the photograph is named after, keeping it
    // under the ceiling the additive sunbeam will push it through.
    vec3 farDot = uFarDot * (0.28 + 0.72 * dayMix);
    color = mix(color, farDot, uDistanceFade);

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const ATMOSPHERE_VERTEX = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  void main() {
    // Deliberately not flipped for BackSide: the fragment shader reasons about the
    // outward normal.
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const ATMOSPHERE_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uSunDirection;
  uniform float uOpacity;
  uniform float uFresnelMax;

  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vWorldPos);

    // Drawn on BackSide, so the only visible part is the far hemisphere showing
    // through the annulus between the planet's silhouette and the shell's. Across
    // that annulus dot(V, N) runs from 0 at the outer edge to -k against the planet.
    // Remapping the fresnel against that known range turns it into a real falloff;
    // used raw it saturates at 1 and paints a flat ring.
    float fresnel = pow(clamp(1.0 - dot(V, N), 0.0, 2.0), 2.5);
    float glow = clamp((fresnel - 1.0) / max(uFresnelMax - 1.0, 1e-4), 0.0, 1.0);
    glow = pow(glow, 1.35); // eases the outer edge to zero instead of a hard circle

    // Earth sits at the world origin, so a surface position doubles as the direction
    // used to decide which side of the limb is lit.
    float lit = smoothstep(-0.28, 0.34, dot(normalize(vWorldPos), normalize(uSunDirection)));

    float alpha = glow * (0.035 + 0.965 * lit) * uOpacity;
    gl_FragColor = vec4(uColor * alpha, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const STAR_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aBrightness;
  attribute vec3 aTint;

  uniform float uPixelRatio;

  varying float vBrightness;
  varying vec3 vTint;

  void main() {
    vBrightness = aBrightness;
    vTint = aTint;
    // No size attenuation: the shell tracks the camera, so distance carries no
    // information here and a fixed pixel size is what a star actually is.
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const STAR_FRAGMENT = /* glsl */ `
  uniform float uOpacity;

  varying float vBrightness;
  varying vec3 vTint;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float falloff = smoothstep(1.0, 0.0, d);
    falloff = pow(falloff, 2.2); // tight core, soft halo — a flat disc reads as paint

    float alpha = falloff * vBrightness * uOpacity;
    if (alpha < 0.002) discard;

    gl_FragColor = vec4(vTint * alpha, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const BEAM_VERTEX = /* glsl */ `
  varying vec2 vNdc;

  void main() {
    // The quad is a child of the camera, scaled to the frustum cross-section at its
    // depth, so its local xy IS normalised device space. That lets the fragment stage
    // compare directly against the Earth's projected position.
    vNdc = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const BEAM_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform vec2 uEarthNdc;
  uniform vec2 uBandNormal;
  uniform float uAspect;
  uniform float uIntensity;

  varying vec2 vNdc;

  float band(float d, float w) {
    float x = d / w;
    return exp(-x * x);
  }

  void main() {
    // Aspect-corrected so the diagonal keeps its angle instead of shearing with the
    // viewport.
    vec2 p = vec2(vNdc.x * uAspect, vNdc.y);
    vec2 e = vec2(uEarthNdc.x * uAspect, uEarthNdc.y);

    vec2 n = normalize(uBandNormal);
    vec2 axis = vec2(-n.y, n.x);

    // Distances are measured FROM the Earth, so the brightest band passes through the
    // dot by construction — at any viewport, at any point of the camera drift.
    float d = dot(p - e, n);
    float s = dot(p - e, axis);

    float acc = 0.0;
    acc += 1.00 * band(d, 0.090);
    acc += 0.34 * band(d - 0.44, 0.052);
    acc += 0.26 * band(d + 0.30, 0.038);
    acc += 0.20 * band(d + 0.72, 0.150);
    acc += 0.10 * band(d - 0.95, 0.220);

    // Scattered light peaks near the optical axis of the streak; bands of constant
    // brightness read as wallpaper stripes rather than as a camera artefact.
    acc *= 0.45 + 0.55 * exp(-pow(s / 1.9, 2.0));

    // The sun is off-frame to the right of this composition: a broad warm spill.
    acc += 0.055 * smoothstep(-0.6, 1.35, p.x);

    // Break the perfect gradient. A vidicon plate is not a gradient: a slow undulation
    // along the streak plus fine grain on top.
    acc *= 0.90 + 0.10 * sin(s * 3.7 + d * 9.0);
    float grain = fract(sin(dot(p * 71.3, vec2(12.9898, 78.233))) * 43758.5453);
    acc *= 0.92 + 0.08 * grain;

    acc *= uIntensity;
    gl_FragColor = vec4(uColor * acc, acc);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

/* ----------------------------------------------------------------------- scene */

export class EarthScene {
  private readonly options: EarthSceneOptions

  private readonly scene = new Scene()
  private readonly camera: PerspectiveCamera
  private renderer: WebGLRenderer | null = null
  private readonly timer = new Timer()

  private readonly earthGroup = new Group()
  private earthMesh: Mesh<SphereGeometry, ShaderMaterial> | null = null
  private cloudMesh: Mesh<SphereGeometry, MeshStandardMaterial> | null = null
  private atmosphereMesh: Mesh<SphereGeometry, ShaderMaterial> | null = null
  private stars: Points<BufferGeometry, ShaderMaterial> | null = null
  private beam: Mesh<PlaneGeometry, ShaderMaterial> | null = null
  private sunLight: DirectionalLight | null = null
  private ambientLight: AmbientLight | null = null

  private earthUniforms: EarthUniforms | null = null
  private atmosphereUniforms: AtmosphereUniforms | null = null
  private starUniforms: StarUniforms | null = null
  private beamUniforms: BeamUniforms | null = null

  private textures: Partial<TextureSet> = {}

  /** Backing store for the public `journey` getter. */
  private journeyValue = 0
  /**
   * Framing applied on top of the journey, 0..1. Held separately from
   * `journeyValue` on purpose: the two answer different questions and must be
   * able to move independently, and nothing here may ever write the journey.
   */
  private compositionValue = 0
  /** Last frustum shift written, so the matrix is not rebuilt every frame. */
  private framingKey = ''
  private autoRotateRequested = true
  private reducedMotion = false
  private spin = INITIAL_SPIN
  private cloudSpin = INITIAL_SPIN

  private needsResize = true
  private resizeObserver: ResizeObserver | null = null
  private motionQuery: MediaQueryList | null = null

  private started = false
  private disposed = false
  private firstFrameRendered = false

  // Scratch vectors, reused so the render loop allocates nothing.
  private readonly tmpRight = new Vector3()
  private readonly tmpUp = new Vector3()
  private readonly tmpTarget = new Vector3()
  private readonly tmpProject = new Vector3()

  constructor(options: EarthSceneOptions) {
    this.options = options
    this.camera = new PerspectiveCamera(FOV, 1, NEAR_PLANE, FAR_PLANE)
    // The journey starts at t = 0, six billion kilometres out; applyJourney overwrites
    // this on the first frame, but the scene is never momentarily framed at the wrong end.
    this.camera.position.set(0, 0, RADIUS_FAR)
    // The beam quad is parented to the camera, and children only render when their
    // parent is part of the traversed graph.
    this.scene.add(this.camera)
  }

  /* --------------------------------------------------------------------- init */

  async init(): Promise<void> {
    if (this.started || this.disposed) return
    this.started = true

    const renderer = new WebGLRenderer({
      canvas: this.options.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    // Re-set every frame by applyJourney; this is the value belonging to t = 0.
    renderer.toneMappingExposure = EXPOSURE_FAR
    renderer.setClearColor(VOID_COLOR, 1)
    this.renderer = renderer

    const maxAnisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())
    const textures = await this.loadTextures(maxAnisotropy)

    // dispose() may have run while the network was busy.
    if (this.disposed) {
      for (const texture of Object.values(textures)) texture.dispose()
      return
    }
    this.textures = textures

    this.buildLights()
    this.buildEarth(textures)
    this.buildClouds(textures)
    this.buildAtmosphere()
    this.buildStars()
    this.buildBeam()

    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.reducedMotion = this.motionQuery.matches
    this.motionQuery.addEventListener('change', this.onMotionPreferenceChange)

    this.resizeObserver = new ResizeObserver(() => {
      this.needsResize = true
    })
    this.resizeObserver.observe(this.options.canvas)
    this.needsResize = true

    this.timer.connect(document)
    renderer.setAnimationLoop(this.renderFrame)
  }

  private async loadTextures(maxAnisotropy: number): Promise<TextureSet> {
    const loader = new TextureLoader()
    let loaded = 0
    this.options.onLoadProgress?.(0)

    const entries = await Promise.all(
      TEXTURE_SPECS.map(async (spec): Promise<readonly [TextureKey, Texture]> => {
        const texture = await loader.loadAsync(spec.url)
        texture.colorSpace = spec.colorSpace
        texture.anisotropy = maxAnisotropy
        // Longitude wraps, latitude must not: clamping T stops the poles bleeding.
        texture.wrapS = RepeatWrapping
        texture.wrapT = ClampToEdgeWrapping
        texture.minFilter = LinearMipmapLinearFilter
        texture.magFilter = LinearFilter
        texture.generateMipmaps = true
        loaded += 1
        this.options.onLoadProgress?.(loaded / TEXTURE_SPECS.length)
        return [spec.key, texture] as const
      }),
    )

    const set = {} as TextureSet
    for (const [key, texture] of entries) set[key] = texture
    return set
  }

  /* ------------------------------------------------------------------- build */

  private buildLights(): void {
    const sun = new DirectionalLight(SUN_COLOR, SUN_INTENSITY)
    sun.position.copy(SUN_DIRECTION).multiplyScalar(50)
    this.scene.add(sun)
    this.sunLight = sun

    const ambient = new AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY)
    this.scene.add(ambient)
    this.ambientLight = ambient

    this.earthGroup.rotation.z = AXIAL_TILT
    this.scene.add(this.earthGroup)
  }

  /** Sun colour premultiplied by intensity, so light and shaders cannot drift apart. */
  private sunColorForShader(): Color {
    const color = new Color(SUN_COLOR)
    const light = this.sunLight
    return light ? color.copy(light.color).multiplyScalar(light.intensity) : color
  }

  private buildEarth(textures: TextureSet): void {
    const uniforms: EarthUniforms = {
      uDayMap: { value: textures.day },
      uNightMap: { value: textures.night },
      uSpecularMap: { value: textures.specular },
      uNormalMap: { value: textures.normal },
      uSunDirection: { value: SUN_DIRECTION.clone() },
      uSunColor: { value: this.sunColorForShader() },
      uPaleBlue: { value: new Color(PALE_BLUE) },
      uFarDot: { value: new Color(FAR_DOT_R, FAR_DOT_G, FAR_DOT_B) },
      uNormalScale: { value: 0.55 },
      uTerminator: { value: 0.1 },
      uDistanceFade: { value: 0 },
    }

    const material = new ShaderMaterial({
      vertexShader: EARTH_VERTEX,
      fragmentShader: EARTH_FRAGMENT,
      uniforms,
    })

    const mesh = new Mesh(new SphereGeometry(EARTH_RADIUS, 128, 128), material)
    mesh.rotation.y = this.spin
    this.earthGroup.add(mesh)
    this.earthMesh = mesh
    this.earthUniforms = uniforms
  }

  private buildClouds(textures: TextureSet): void {
    // MeshStandardMaterial on purpose: this is the surface actually lit by the
    // DirectionalLight, which keeps the sun a real object in the scene rather than a
    // number that only exists inside shader uniforms.
    const material = new MeshStandardMaterial({
      color: 0xffffff,
      alphaMap: textures.clouds, // grayscale, white = cloud
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      roughness: 0.95,
      metalness: 0,
    })

    const mesh = new Mesh(new SphereGeometry(CLOUD_RADIUS, 96, 96), material)
    mesh.rotation.y = this.cloudSpin
    mesh.renderOrder = ORDER_CLOUDS
    this.earthGroup.add(mesh)
    this.cloudMesh = mesh
  }

  private buildAtmosphere(): void {
    // Largest value 1 - dot(V, N) can reach inside the visible annulus, derived from
    // the shell/planet radius ratio. Passed in so the shader normalises against real
    // geometry instead of a hand-tuned magic number.
    const ratio = ATMOSPHERE_RADIUS / EARTH_RADIUS
    const k = Math.sqrt(Math.max(0, 1 - 1 / (ratio * ratio)))

    const uniforms: AtmosphereUniforms = {
      uColor: { value: new Color(PALE_BLUE) },
      uSunDirection: { value: SUN_DIRECTION.clone() },
      uOpacity: { value: 1 },
      uFresnelMax: { value: Math.pow(1 + k, 2.5) },
    }

    const material = new ShaderMaterial({
      vertexShader: ATMOSPHERE_VERTEX,
      fragmentShader: ATMOSPHERE_FRAGMENT,
      uniforms,
      side: BackSide,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })

    const mesh = new Mesh(new SphereGeometry(ATMOSPHERE_RADIUS, 96, 96), material)
    mesh.renderOrder = ORDER_ATMOSPHERE
    this.earthGroup.add(mesh)
    this.atmosphereMesh = mesh
    this.atmosphereUniforms = uniforms
  }

  private buildStars(): void {
    const random = mulberry32(STAR_SEED)
    const positions = new Float32Array(STAR_COUNT * 3)
    const sizes = new Float32Array(STAR_COUNT)
    const brightness = new Float32Array(STAR_COUNT)
    const tints = new Float32Array(STAR_COUNT * 3)

    const cool = new Color(0.74, 0.83, 1.0)
    const warm = new Color(1.0, 0.88, 0.74)
    const white = new Color(1, 1, 1)
    const tint = new Color()

    for (let i = 0; i < STAR_COUNT; i += 1) {
      // Uniform on a sphere: z is sampled linearly rather than the polar angle,
      // otherwise the poles clot.
      const z = 1 - 2 * random()
      const ring = Math.sqrt(Math.max(0, 1 - z * z))
      const phi = 2 * Math.PI * random()
      const shell = STAR_SHELL_MIN + random() * (STAR_SHELL_MAX - STAR_SHELL_MIN)

      positions[i * 3] = ring * Math.cos(phi) * shell
      positions[i * 3 + 1] = z * shell
      positions[i * 3 + 2] = ring * Math.sin(phi) * shell

      // Steep power law: a real sky is mostly faint stars with a handful of bright
      // ones. Uniform magnitudes look like television static.
      const magnitude = random()
      brightness[i] = 0.06 + Math.pow(magnitude, 5) * 1.5
      sizes[i] = 1.1 + Math.pow(magnitude, 4) * 2.6

      tint.copy(cool).lerp(warm, random()).lerp(white, 0.45)
      tints[i * 3] = tint.r
      tints[i * 3 + 1] = tint.g
      tints[i * 3 + 2] = tint.b
    }

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new BufferAttribute(sizes, 1))
    geometry.setAttribute('aBrightness', new BufferAttribute(brightness, 1))
    geometry.setAttribute('aTint', new BufferAttribute(tints, 3))

    const uniforms: StarUniforms = {
      uPixelRatio: { value: this.renderer?.getPixelRatio() ?? 1 },
      uOpacity: { value: 0.25 },
    }

    const material = new ShaderMaterial({
      vertexShader: STAR_VERTEX,
      fragmentShader: STAR_FRAGMENT,
      uniforms,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })

    const points = new Points(geometry, material)
    // The shell is repositioned every frame, so a cached bounding sphere would cull
    // it at the wrong moments.
    points.frustumCulled = false
    this.scene.add(points)
    this.stars = points
    this.starUniforms = uniforms
  }

  private buildBeam(): void {
    const uniforms: BeamUniforms = {
      uColor: { value: new Color(SUNBEAM) },
      uEarthNdc: { value: new Vector2(0, 0) },
      uBandNormal: { value: new Vector2(-Math.sin(BAND_ANGLE), Math.cos(BAND_ANGLE)) },
      uAspect: { value: 1 },
      uIntensity: { value: 0 },
    }

    const material = new ShaderMaterial({
      vertexShader: BEAM_VERTEX,
      fragmentShader: BEAM_FRAGMENT,
      uniforms,
      blending: AdditiveBlending,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })

    const mesh = new Mesh(new PlaneGeometry(2, 2), material)
    mesh.frustumCulled = false
    mesh.renderOrder = ORDER_BEAM
    mesh.position.z = -BEAM_PLANE_DISTANCE
    mesh.visible = false
    this.camera.add(mesh)
    this.beam = mesh
    this.beamUniforms = uniforms
  }

  /* ------------------------------------------------------------- public API */

  /**
   * Position along the way home.
   *
   * t = 0 — Voyager's distance: Earth is a two-pixel dot inside a band of scattered
   *         sunlight, no atmosphere, no clouds, the frame nearly dark.
   * t = 1 — the arrival: Earth fills the frame, atmosphere and clouds fully present,
   *         the light bands gone. The camera does not move again past this point.
   */
  setJourney(t: number): void {
    this.journeyValue = MathUtils.clamp(t, 0, 1)
  }

  /** Position along the way home, clamped to 0..1. Read-only; setJourney owns it. */
  get journey(): number {
    return this.journeyValue
  }

  /**
   * How far the framing has moved off the journey's own composition, 0..1.
   *
   * 0 is not merely "the default" — it is a guarantee. At 0 the aim term adds
   * exactly +0 and the radius term multiplies by exactly 1, both of which are
   * identities in IEEE 754, and the branch that would apply a composition-only
   * aim is not entered at all. The camera the journey produces is therefore the
   * camera that gets rendered, bit for bit, exactly as before this existed.
   *
   * 1 is the fully recomposed frame, for when the reading is over and the planet
   * has to give the screen to something else.
   *
   * This never touches `journeyValue`: the journey remains the source of truth
   * for distance and angle, and this rides on top of whatever it produced.
   */
  setComposition(amount: number): void {
    this.compositionValue = MathUtils.clamp(amount, 0, 1)
  }

  /** Current framing offset, clamped to 0..1. Read-only; setComposition owns it. */
  get composition(): number {
    return this.compositionValue
  }

  /**
   * Where the Earth is drawn, in CSS pixels of the canvas box — so an HTML annotation
   * can sit on the planet at every distance instead of at one hard-coded percentage.
   *
   * Returns null before the first frame and after dispose: until something has been
   * rendered there is no camera state that matches what is on screen.
   */
  getDotScreenPosition(): DotScreenPosition | null {
    if (this.disposed || !this.renderer || !this.firstFrameRendered) return null

    const canvas = this.options.canvas
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (width === 0 || height === 0) return null

    // project() reads matrixWorldInverse, and the renderer only refreshes that during
    // render — the same refresh applyJourney does before it projects for the beam.
    this.camera.updateMatrixWorld()
    this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert()

    // Earth sits at the world origin. Scratch vector: this runs every frame, and a
    // fresh Vector3 per call would be pure garbage.
    const ndc = this.tmpProject.set(0, 0, 0).project(this.camera)

    // The camera orbits the origin, so its distance IS the radius applyJourney solved
    // for — including the portrait push-back. Reading it back beats recomputing the
    // journey curve here, where the two could silently drift apart.
    const distance = this.camera.position.length()

    // Angular size, not a projected edge point: the silhouette's edge is not the same
    // point as centre + radius in screen space, and projecting it would skew with the
    // off-axis offset. A viewport maps tan(angle/2), which is what the ratio below is.
    const tanHalfApparent = EARTH_RADIUS / distance
    const tanHalfFov = Math.tan(this.camera.fov * MathUtils.DEG2RAD * 0.5)
    // clientHeight is CSS pixels, so the result is too — no devicePixelRatio anywhere.
    const radiusPx = (height / 2) * (tanHalfApparent / tanHalfFov)

    return {
      x: (ndc.x * 0.5 + 0.5) * width,
      y: (0.5 - ndc.y * 0.5) * height,
      radiusPx,
      onScreen:
        ndc.x >= -1 && ndc.x <= 1 && ndc.y >= -1 && ndc.y <= 1 && ndc.z >= -1 && ndc.z <= 1,
    }
  }

  setAutoRotate(on: boolean): void {
    this.autoRotateRequested = on
  }

  dispose(): void {
    if (this.disposed) return
    this.disposed = true

    this.renderer?.setAnimationLoop(null)

    this.resizeObserver?.disconnect()
    this.resizeObserver = null

    this.motionQuery?.removeEventListener('change', this.onMotionPreferenceChange)
    this.motionQuery = null

    this.timer.disconnect()
    this.timer.dispose()

    // The camera is a child of the scene, so this reaches the beam quad too.
    this.scene.traverse((node: Object3D) => {
      if (node instanceof Mesh || node instanceof Points) {
        node.geometry.dispose()
        disposeMaterial(node.material)
      }
    })

    // Textures are never released by three's material disposal path.
    for (const texture of Object.values(this.textures)) texture.dispose()
    this.textures = {}

    this.sunLight?.dispose()
    this.ambientLight?.dispose()

    this.camera.clear()
    this.earthGroup.clear()
    this.scene.clear()

    this.earthMesh = null
    this.cloudMesh = null
    this.atmosphereMesh = null
    this.stars = null
    this.beam = null
    this.sunLight = null
    this.ambientLight = null
    this.earthUniforms = null
    this.atmosphereUniforms = null
    this.starUniforms = null
    this.beamUniforms = null

    if (this.renderer) {
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer = null
    }
  }

  /* ------------------------------------------------------------------- loop */

  private readonly onMotionPreferenceChange = (event: MediaQueryListEvent): void => {
    this.reducedMotion = event.matches
  }

  private readonly renderFrame = (): void => {
    const renderer = this.renderer
    if (this.disposed || !renderer) return

    this.timer.update()
    // Clamped: returning from a background tab must not teleport the Earth.
    const delta = Math.min(this.timer.getDelta(), 0.1)

    this.applyResize(renderer)
    this.applySpin(delta)
    this.applyJourney(renderer)

    renderer.render(this.scene, this.camera)

    if (!this.firstFrameRendered) {
      this.firstFrameRendered = true
      this.options.onReady?.()
    }
  }

  private applyResize(renderer: WebGLRenderer): void {
    if (!this.needsResize) return

    const canvas = this.options.canvas
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    // Retry next frame rather than divide by zero while the layout settles.
    if (width === 0 || height === 0) return
    this.needsResize = false

    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)
    // updateStyle = false: CSS owns the box of this full-bleed canvas.
    renderer.setSize(width, height, false)

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    if (this.starUniforms) this.starUniforms.uPixelRatio.value = pixelRatio

    if (this.beam && this.beamUniforms) {
      // Scale the quad to the exact frustum cross-section at its depth, which is what
      // makes its local coordinates identical to NDC.
      const planeHeight = 2 * BEAM_PLANE_DISTANCE * Math.tan(MathUtils.degToRad(FOV) / 2)
      this.beam.scale.set((planeHeight * this.camera.aspect) / 2, planeHeight / 2, 1)
      this.beamUniforms.uAspect.value = this.camera.aspect
    }
  }

  /**
   * Runs at every distance — while Earth is still a dot and after the arrival alike.
   * Past t = 1 this is the only motion left anywhere in the scene.
   */
  private applySpin(delta: number): void {
    if (!this.autoRotateRequested || this.reducedMotion) return
    this.spin += delta * EARTH_SPIN
    this.cloudSpin += delta * EARTH_SPIN * CLOUD_SPIN_FACTOR
    if (this.earthMesh) this.earthMesh.rotation.y = this.spin
    if (this.cloudMesh) this.cloudMesh.rotation.y = this.cloudSpin
  }

  /**
   * The exploration framing, as a shifted frustum.
   *
   * The camera keeps pointing straight at the planet; what moves is the window we
   * read out of its image. That is the whole reason the disc stays a perfect
   * circle at the edge of the frame instead of stretching into an ellipse.
   *
   * The virtual frame is the smallest one that can hold this window with the
   * planet at the requested spot, so with the planet vertically centred it comes
   * out exactly the canvas height and the vertical field of view is untouched.
   *
   * Does nothing at composition 0 unless a previous frame shifted the frustum, in
   * which case it puts it back — so the reading never pays for this existing.
   */
  private applyComposition(): void {
    const camera = this.camera
    const width = this.options.canvas.clientWidth
    const height = this.options.canvas.clientHeight
    const amount = this.compositionValue

    if (amount <= 0) {
      if (camera.view !== null && camera.view.enabled) {
        camera.clearViewOffset()
        camera.aspect = height === 0 ? camera.aspect : width / height
        camera.updateProjectionMatrix()
        this.framingKey = ''
      }
      return
    }
    if (width === 0 || height === 0) return

    // Landscape has room beside the planet, portrait only above it.
    const target = width < height ? COMPOSITION_PORTRAIT : COMPOSITION_LANDSCAPE
    // Interpolated from the centre so a partial value still frames sensibly, even
    // though the piece only ever switches between the two ends.
    const centreX = MathUtils.lerp(0.5, target.x, amount) * width
    const centreY = MathUtils.lerp(0.5, target.y, amount) * height

    const fullWidth = 2 * Math.max(centreX, width - centreX)
    const fullHeight = 2 * Math.max(centreY, height - centreY)
    const offsetX = fullWidth / 2 - centreX
    const offsetY = fullHeight / 2 - centreY

    // setViewOffset rebuilds the projection matrix, so it is called only when one
    // of its inputs has actually moved rather than on every frame.
    const key = `${fullWidth}|${fullHeight}|${offsetX}|${offsetY}|${width}|${height}`
    if (key === this.framingKey) return
    this.framingKey = key

    camera.aspect = fullWidth / fullHeight
    camera.setViewOffset(fullWidth, fullHeight, offsetX, offsetY, width, height)
  }

  private applyJourney(renderer: WebGLRenderer): void {
    const t = this.journeyValue
    // Symmetric and gentle, but only lightly so. A full smootherstep would still grow
    // the disc 2.85x across the middle tenth against 1.05x at the ends; blended against
    // the linear ramp it eases away from the dot and settles into the arrival while
    // every tenth stays inside 1.52x..2.04x.
    const eased = MathUtils.lerp(t, MathUtils.smootherstep(t, 0, 1), EASE_SOFTNESS)

    // Interpolate what the eye actually measures — the ANGLE the disc subtends — in log
    // space, then solve for the distance that produces it. Interpolating the distance
    // instead (the previous approach) hides most of the growth in a narrow band of the
    // timeline, because angle = 2 * atan(r / d) is nothing like linear in d.
    const angularSize = Math.exp(
      MathUtils.lerp(Math.log(ANGLE_FAR), Math.log(ANGLE_NEAR), eased),
    )
    const baseRadius = EARTH_RADIUS / Math.tan(angularSize / 2)

    // Monotonic: the approach shortens the distance ~327x over the journey while this
    // can only lengthen it by REFERENCE_ASPECT / aspect, so the camera never backs off.
    const portraitFit = Math.max(1, REFERENCE_ASPECT / this.camera.aspect)

    const composition = this.compositionValue

    // The frustum, not the lens or the aim, is what carries the planet aside; see
    // applyComposition. All that is left here is the distance, and at composition
    // 0 the factor is `1 + (SCALE - 1) * 0` = exactly 1. Multiplying a finite
    // double by 1 returns it unchanged, so `radius` is the bits the journey alone
    // produced and the reading is untouched.
    const radius =
      baseRadius *
      (1 + (portraitFit - 1) * eased) *
      (1 + (COMPOSITION_DISTANCE_SCALE - 1) * composition)

    this.applyComposition()

    const azimuth = MathUtils.lerp(AZIMUTH_FAR, AZIMUTH_NEAR, eased)
    const elevation = MathUtils.lerp(ELEVATION_FAR, ELEVATION_NEAR, eased)
    const cosElevation = Math.cos(elevation)

    this.camera.position.set(
      radius * cosElevation * Math.sin(azimuth),
      radius * Math.sin(elevation),
      radius * cosElevation * Math.cos(azimuth),
    )
    this.camera.up.set(0, 1, 0)
    this.camera.lookAt(0, 0, 0)
    this.camera.updateMatrixWorld(true)

    // Slide the aim point sideways so the dot sits off-centre inside its band at the
    // far end and drifts back to a centred arrival. Deriving the offset from the camera
    // basis and the current distance keeps the resulting NDC offset constant across
    // viewports and distances.
    const offsetAmount = 1 - fade(t, FADE_OFFSET)

    // Composition does not appear here at all: the framing is carried by the
    // frustum instead, so this is byte for byte the expression the journey has
    // always used, and the reading cannot be affected by anything downstream.
    if (offsetAmount > 0.001) {
      const tanHalfFov = Math.tan(MathUtils.degToRad(FOV) / 2)
      const right = this.tmpRight.setFromMatrixColumn(this.camera.matrixWorld, 0)
      const up = this.tmpUp.setFromMatrixColumn(this.camera.matrixWorld, 1)
      const target = this.tmpTarget
        .set(0, 0, 0)
        .addScaledVector(
          right,
          -FAR_OFFSET_X * offsetAmount * radius * tanHalfFov * this.camera.aspect,
        )
        .addScaledVector(up, -FAR_OFFSET_Y * offsetAmount * radius * tanHalfFov)
      this.camera.lookAt(target)
      this.camera.updateMatrixWorld(true)
    }

    // project() reads matrixWorldInverse, which the renderer only refreshes during
    // render — refresh it here because the beam needs the projection first.
    this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert()

    /* ------------------------------------------------------------- the fade-in */

    // The frame lifts out of the dark as the distance closes: at t = 0 the exposure is
    // set for scattered light, the way the Voyager plate was, and everything but the
    // bands is crushed. Nothing below is a threshold — every value is a smootherstep
    // window, and the windows overlap.
    renderer.toneMappingExposure = MathUtils.lerp(
      EXPOSURE_FAR,
      EXPOSURE_NEAR,
      fade(t, FADE_EXPOSURE),
    )

    if (this.stars && this.starUniforms) {
      // The sky follows the camera and grows with it, so the camera can never fly
      // through the shell and the Earth always stays nearer than the stars in depth.
      this.stars.position.copy(this.camera.position)
      this.stars.scale.setScalar(Math.max(1, radius / 120))
      // Two overlapping moves: the bands wash the sky out at the far end, and a lit
      // Earth washes it out again at the near end. In between, the sky is at its most
      // open — which is where the journey actually spends its time.
      const opened = MathUtils.lerp(
        STAR_OPACITY_FAR,
        STAR_OPACITY_OPEN,
        fade(t, FADE_STARS_IN),
      )
      this.starUniforms.uOpacity.value = MathUtils.lerp(
        opened,
        STAR_OPACITY_ARRIVED,
        fade(t, FADE_STARS_WASH),
      )
    }

    if (this.atmosphereMesh && this.atmosphereUniforms) {
      // Invisible from six billion kilometres — a limb glow on a two-pixel disc would
      // only be a halo the dot does not have — and unmistakable by the time we arrive.
      const opacity = fade(t, FADE_ATMOSPHERE)
      this.atmosphereUniforms.uOpacity.value = opacity
      this.atmosphereMesh.visible = opacity > 0.001
    }

    if (this.cloudMesh) {
      const opacity = CLOUD_OPACITY * fade(t, FADE_CLOUDS)
      this.cloudMesh.material.opacity = opacity
      this.cloudMesh.visible = opacity > 0.001
    }

    if (this.earthUniforms) {
      // Full far-dot tint while the disc is a few pixels of high-mip mud, releasing to
      // the real texture as soon as there are enough pixels to carry it.
      this.earthUniforms.uDistanceFade.value = 1 - fade(t, FADE_DOT_COLOR)
    }

    if (this.beam && this.beamUniforms) {
      const intensity = BEAM_INTENSITY * (1 - fade(t, FADE_BEAM_OUT))
      this.beamUniforms.uIntensity.value = intensity
      this.beam.visible = intensity > 0.001
      if (this.beam.visible) {
        // Earth is at the origin; its projection anchors the brightest band, so the dot
        // at t = 0 is inside the light by construction — at any viewport, at any point
        // of the camera's drift.
        const ndc = this.tmpProject.set(0, 0, 0).project(this.camera)
        this.beamUniforms.uEarthNdc.value.set(ndc.x, ndc.y)
      }
    }
  }
}
