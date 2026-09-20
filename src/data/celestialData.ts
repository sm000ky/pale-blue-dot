export interface CelestialBodyInfo {
  id: string;
  name: string;
  jpName: string;
  category: 'Planet' | 'Star' | 'Satellite';
  tagline: string;
  distanceVoyager: string;
  realDistanceKm: string;
  diameter: string;
  facts: string[];
  voyagerStory: string;
}

export const CELESTIAL_DATABASE: Record<string, CelestialBodyInfo> = {
  earth: {
    id: 'earth',
    name: 'EARTH // TERRA',
    jpName: '地球 (Terra)',
    category: 'Planet',
    tagline: '0.12 of a single pixel suspended in a sunbeam',
    distanceVoyager: '40.47 AU (6.06 billion km)',
    realDistanceKm: '6,054,558,000 km',
    diameter: '12,742 km mean diameter',
    facts: [
      'Occupied only 0.12 pixel on Voyager 1 Narrow Angle Camera sensor.',
      'Photographed using Blue, Green, and Violet filters on 14 Feb 1990.',
      'Exposure time: 0.48 seconds through a 1500mm f/8.5 catadioptric telescope.'
    ],
    voyagerStory:
      'The final photograph in the 60-frame Solar System Family Portrait. NASA engineers initially feared pointing the camera near the Sun might burn out the vidicon sensors, but Carl Sagan convinced NASA leadership that a backwards look was historically vital.'
  },
  moon: {
    id: 'moon',
    name: 'THE MOON // LUNA',
    jpName: '月 (Luna)',
    category: 'Satellite',
    tagline: "Earth's only natural satellite",
    distanceVoyager: '40.47 AU (6.06 billion km)',
    realDistanceKm: '384,400 km from Earth',
    diameter: '3,474 km diameter',
    facts: [
      'Tidally locked to Earth: always shows the exact same face to humanity.',
      'Surface scarred by 4.5 billion years of asteroid and comet impacts.',
      'The only celestial body beyond Earth where human feet have walked.'
    ],
    voyagerStory:
      'In the original 1990 raw frame, the Moon was too faint and closely packed to be separated from Earth without computer contrast enhancement.'
  },
  sun: {
    id: 'sun',
    name: 'THE SUN // SOL',
    jpName: '太陽 (Sol)',
    category: 'Star',
    tagline: 'The yellow dwarf anchor of our solar system',
    distanceVoyager: '40.52 AU (6.07 billion km)',
    realDistanceKm: '149,597,870 km from Earth',
    diameter: '1,392,700 km diameter',
    facts: [
      'Spectral Type G2V main-sequence star, surface temp 5,778 K.',
      'Contains 99.86% of the total mass in the entire solar system.',
      'Photons emitted from its core take 100,000 years to reach the surface.'
    ],
    voyagerStory:
      'Sunlight scattered off Voyager 1’s camera baffles and optics created the dramatic diagonal diffraction streaks (sunbeams) in the iconic 1990 photograph.'
  },
  mars: {
    id: 'mars',
    name: 'MARS // ARES',
    jpName: '火星 (Mars)',
    category: 'Planet',
    tagline: 'The frozen rust desert',
    distanceVoyager: '39.8 AU (5.95 billion km)',
    realDistanceKm: '227.9 million km from Sun',
    diameter: '6,779 km diameter',
    facts: [
      'Home to Olympus Mons, the largest volcano in the solar system (21 km high).',
      'Atmospheric pressure is less than 1% of Earth, mostly carbon dioxide.',
      'Observed by robotic orbiters, landers, and rovers for over 50 years.'
    ],
    voyagerStory:
      'During the 14 February 1990 Family Portrait sequence, Mars was too close to the glare of the Sun and camera optics to yield a clear resolved image.'
  },
  jupiter: {
    id: 'jupiter',
    name: 'JUPITER // JOVE',
    jpName: '木星 (Jupiter)',
    category: 'Planet',
    tagline: 'The king of planets and cosmic shield',
    distanceVoyager: '42.1 AU (6.30 billion km)',
    realDistanceKm: '778.5 million km from Sun',
    diameter: '139,820 km diameter',
    facts: [
      'Massive gas giant: contains 2.5 times the mass of all other planets combined.',
      'The Great Red Spot is an anticyclonic storm larger than planet Earth.',
      'Possesses at least 95 known moons, including ocean-bearing Europa.'
    ],
    voyagerStory:
      'Voyager 1 conducted its historic closest approach to Jupiter on March 5, 1979, discovering volcanic activity on Io and intricate ring systems around the giant.'
  }
};
