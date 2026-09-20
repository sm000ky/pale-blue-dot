# 🛰️ PALE BLUE DOT // VOYAGER ODYSSEY
### An Interactive 3D WebGL Space Odyssey & Carl Sagan Monologue Experience
> *Crafted with cosmic passion by `sm000ky × Zero Two`*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-89cff0?style=for-the-badge&logo=vercel)](https://pale-blue-dot.vercel.app)
[![Three.js](https://img.shields.io/badge/3D%20Engine-Three.js%20WebGL-05070c?style=for-the-badge&logo=three.js)](https://threejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-f3c66f?style=for-the-badge)](LICENSE)

---

## 🌌 Overview

On **14 February 1990**, at the edge of the solar system, **Voyager 1** turned its camera back toward home and photographed Earth as a single point of light **6.06 billion kilometers** away.

**PALE BLUE DOT: VOYAGER ODYSSEY** is an interactive, cinematic 3D WebGL reading of Carl Sagan's timeless monologue from his 1994 book *Pale Blue Dot: A Vision of the Human Future in Space*.

---

## ✨ Features

### 1. Photorealistic 3D Earth & Procedural Solar System (Three.js WebGL)
- **Multi-Layer PBR Earth Globe:**
  - High-resolution daylight continent map with ocean specular reflections.
  - Golden night city lights illuminating the dark side of Earth via custom GLSL shader hooks.
  - Swirling atmospheric cloud layer with independent rotation.
  - Custom Fresnel atmospheric rim glow shader emitting an ethereal cyan halo.
- **Voyager 1 Sunbeam Streak:**
  - The iconic diagonal sunbeam ray cutting through cosmic dust, suspending the pale blue pixel of Earth.
- **Deep Space Starfield:**
  - 3,500 procedural stars with realistic astronomical color temperatures (ice blue, pale gold, diamond white).

### 2. Interactive Camera Modes
- 🎬 **Cinema Voyage (Director Mode):**
  - Smooth camera journey from 40 AU (6 billion km) down to low-Earth orbit (400 km), synchronized to Carl Sagan's narration.
- 🌐 **Free Orbit Mode:**
  - 360° interactive touch and mouse orbit controls to inspect continents, oceans, and city lights at any angle.
- 💿 **Golden Record Chamber:**
  - Interactive 3D Voyager Golden Record spinning at 33⅓ RPM with metallic sheen.

### 3. Dual-Layer Audio Engine with Dynamic Ducking
- **Narration:** Remastered vocal track of Carl Sagan's 1994 reading (`/audio/sagan-vocals.mp3`).
- **Soundtrack:** Scott Buckley's majestic neoclassical orchestral composition "Aurora" (`/audio/aurora.mp3`).
- **Dynamic Audio Ducking:** The orchestra automatically ducks when Sagan speaks and swells with emotional resonance during pauses.

### 4. Kinetic Multi-Language Subtitles
- Synchronized phrase-by-phrase kinetic subtitles with editorial typography.
- Supported languages:
  - 🇮🇩 **Bahasa Indonesia (ID)**: Terjemahan puitis yang menyentuh kalbu.
  - 🇬🇧 **English (EN)**: The original words of Carl Sagan.
  - 🇯🇵 **Japanese (JA)**: この青い点を見つめてごらん.

### 5. Astrometric HUD Telemetry
- Real-time countdown of distance from Earth (6.06 billion km down to orbit).
- Voyager 1 velocity (17.0 km/s / 61,200 km/h).
- Speed of light communication delay (5 hours 36 minutes).
- Interactive timeline scrubber with chapter markers.

### 6. NASA Golden Record Archive Vault
- Interactive modal showcasing the artifact sent to interstellar space:
  - Explanations of the Pulsar Clock, Hydrogen Atom time unit, and NASA imagery.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/sm000ky/pale-blue-dot.git
cd pale-blue-dot

# Install dependencies
bun install

# Start development server
bun run dev

# Build production bundle
bun run build
```

---

## 📜 Credits & Attribution

- **Monologue:** Carl Sagan, *Pale Blue Dot: A Vision of the Human Future in Space* (1994). © Democritus Properties, LLC.
- **Music:** "Aurora" by Scott Buckley (CC BY 4.0).
- **Earth Textures:** Solar System Scope (INOVE) (CC BY 4.0).
- **Spacecraft & Archival Imagery:** NASA / JPL-Caltech.

---

<div align="center">
  <sub>"To preserve and cherish the pale blue dot, the only home we've ever known." — Carl Sagan</sub><br/>
  <sub>"Crafted by sm000ky × Zero Two" 💕</sub>
</div>
