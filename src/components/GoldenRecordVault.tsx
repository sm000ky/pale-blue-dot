import React, { useState } from 'react';
import { X, Disc, ExternalLink, Sparkles, Radio, Info } from 'lucide-react';

interface GoldenRecordVaultProps {
  onClose: () => void;
}

export const GoldenRecordVault: React.FC<GoldenRecordVaultProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'cover' | 'record' | 'voyager' | 'photo'>('cover');

  return (
    <div className="fixed inset-0 z-50 bg-[#05070c]/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#0c101a] border border-[#232d44] rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-fadeIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f283d] bg-[#090d16]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#f3c66f]/20 border border-[#f3c66f]/40 flex items-center justify-center text-[#f3c66f]">
              <Disc className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white tracking-wide">
                VOYAGER GOLDEN RECORD // 1977
              </h2>
              <p className="font-mono text-[10px] text-slate-400">
                A Message in a Bottle Cast into the Cosmic Ocean
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#141b2a] hover:bg-[#1f2a40] text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#1f283d] bg-[#0a0e18] px-6 gap-2">
          {(
            [
              { id: 'cover', label: 'The Cover & Pulsar Map' },
              { id: 'record', label: 'The Golden Phonograph' },
              { id: 'voyager', label: 'Voyager 1 Spacecraft' },
              { id: 'photo', label: 'The Pale Blue Dot Frame' }
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`py-3 px-3 font-mono text-xs border-b-2 transition-all ${
                activeTab === id
                  ? 'border-[#f3c66f] text-white font-bold bg-[#131a2c]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'cover' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative rounded-2xl overflow-hidden border border-[#232d44] bg-[#070a12] p-2 shadow-xl flex items-center justify-center">
                <img
                  src="/archive/golden-record-cover.webp"
                  alt="Voyager Golden Record Cover"
                  className="max-h-72 object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3 font-serif text-slate-300 text-sm leading-relaxed">
                <h3 className="font-display text-lg text-white font-semibold">
                  How to Decode the Earth Message
                </h3>
                <p>
                  The cover of the Golden Record contains symbolic instructions designed by Carl Sagan, Frank Drake, and their team for any extraterrestrial civilization that might discover it.
                </p>
                <div className="space-y-2 font-mono text-xs text-slate-400 border-l-2 border-[#f3c66f] pl-3">
                  <p><strong className="text-white">Pulsar Clock:</strong> 14 lines radiating from the center pinpoint the location of our Sun relative to 14 pulsars, with binary codes indicating their rotational periods.</p>
                  <p><strong className="text-white">Hydrogen Atom:</strong> Two lowest states of the hydrogen atom define the fundamental unit of time (0.70 billionths of a second) and length (21 cm).</p>
                  <p><strong className="text-white">Playback Speed:</strong> 33⅓ revolutions per minute, played with the stylus needle mounted on the spacecraft.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'record' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative rounded-2xl overflow-hidden border border-[#232d44] bg-[#070a12] p-2 shadow-xl flex items-center justify-center">
                <img
                  src="/archive/golden-record-front.webp"
                  alt="Voyager Golden Record Front"
                  className="max-h-72 object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3 font-serif text-slate-300 text-sm leading-relaxed">
                <h3 className="font-display text-lg text-white font-semibold">
                  Sounds & Music of Planet Earth
                </h3>
                <p>
                  Gold-plated copper phonograph disc containing 115 images, natural sounds (surf, wind, thunder, birds, whales), musical selections from diverse cultures (including Indonesian Gamelan "Puspawarna", Bach, Beethoven, Chuck Berry), spoken greetings in 55 human languages, and the brainwaves of Ann Druyan.
                </p>
                <div className="p-3 bg-[#111726] border border-[#232d44] rounded-xl text-xs font-mono text-slate-300">
                  <div className="text-[#89cff0] font-semibold mb-1">Carl Sagan's Dedication:</div>
                  &ldquo;The spacecraft will be encountered and the record played only if there are advanced spacefaring civilizations in interstellar space. But the launching of this bottle into the cosmic ocean says something very hopeful about life on this planet.&rdquo;
                </div>
              </div>
            </div>
          )}

          {activeTab === 'voyager' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative rounded-2xl overflow-hidden border border-[#232d44] bg-[#070a12] p-2 shadow-xl flex items-center justify-center">
                <img
                  src="/archive/voyager-spacecraft.webp"
                  alt="Voyager 1 Spacecraft"
                  className="max-h-72 object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3 font-serif text-slate-300 text-sm leading-relaxed">
                <h3 className="font-display text-lg text-white font-semibold">
                  The Furthest Human Artifact
                </h3>
                <p>
                  Launched on September 5, 1977, Voyager 1 is the most distant human-made object from Earth. Cruising at 17 km/s (61,200 km/h), it entered interstellar space in August 2012.
                </p>
                <ul className="list-disc list-inside font-mono text-xs text-slate-400 space-y-1">
                  <li>Current Distance: &gt; 24 billion kilometers (&gt; 160 AU)</li>
                  <li>Power: Radioisotope Thermoelectric Generators (RTG)</li>
                  <li>Antenna: 3.7-meter high-gain parabolic reflector</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'photo' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative rounded-2xl overflow-hidden border border-[#232d44] bg-[#070a12] p-2 shadow-xl flex items-center justify-center">
                <img
                  src="/archive/pale-blue-dot-revisited.webp"
                  alt="Pale Blue Dot Revisited NASA"
                  className="max-h-72 object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3 font-serif text-slate-300 text-sm leading-relaxed">
                <h3 className="font-display text-lg text-white font-semibold">
                  14 February 1990: The Family Portrait
                </h3>
                <p>
                  At Carl Sagan's persistent request, NASA commanded Voyager 1 to turn its camera back toward home one final time before its cameras were turned off forever to save power.
                </p>
                <p>
                  From 6.06 billion kilometers away, Earth occupied just 0.12 of a single pixel, caught directly in a ray of scattered sunlight.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#1f283d] bg-[#090d16] flex items-center justify-between text-xs font-mono text-slate-500">
          <span>NASA JPL-Caltech / Democritus Properties LLC</span>
          <a
            href="https://science.nasa.gov/mission/voyager/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#89cff0] hover:underline"
          >
            <span>NASA Voyager Mission</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
