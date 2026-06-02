import React, { useState, useEffect } from "react";
import { Project, Track, AudioSettings } from "../types";
import { Sliders, Volume2, Waves, Brain, Disc, Radio, Activity } from "lucide-react";

interface AudioMixerProps {
  project: Project;
  tracks: Track[];
  onUpdateTrackVolume: (trackId: string, vol: number) => void;
  onUpdateMasterVolume: (vol: number) => void;
  isPlaying: boolean;
}

export default function AudioMixer({
  project,
  tracks,
  onUpdateTrackVolume,
  onUpdateMasterVolume,
  isPlaying
}: AudioMixerProps) {
  // Simulate active level meters blinking when isPlaying is true
  const [meters, setMeters] = useState<Record<string, number>>({});
  const [automationMode, setAutomationMode] = useState<Record<string, 'READ' | 'WRITE'>>({
    "track-a1": "READ",
    "track-a2": "READ",
    "track-a3": "READ",
    "master": "READ"
  });

  const [soloStates, setSoloStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        const newMeters: Record<string, number> = {};
        
        // Simulating 3 audio channels (A1, A2, A3) and Master
        ["track-a1", "track-a2", "track-a3"].forEach(id => {
          if (id === 'track-a1') {
            newMeters[id] = Math.floor(Math.random() * 40 + 55);
          } else if (id === 'track-a2') {
            newMeters[id] = Math.floor(Math.random() * 30 + 40);
          } else {
            newMeters[id] = Math.floor(Math.random() * 25 + 20);
          }
        });

        // Master level average
        const avg = (newMeters["track-a1"] + newMeters["track-a2"] + newMeters["track-a3"]) / 3;
        newMeters["master"] = Math.min(100, Math.floor(avg * (project.audioMixer.masterVolume / 100)));
        
        setMeters(newMeters);
      }, 95);
    } else {
      setMeters({
        "track-a1": 0,
        "track-a2": 0,
        "track-a3": 0,
        "master": 0
      });
    }

    return () => clearInterval(timer);
  }, [isPlaying, project.audioMixer.masterVolume]);

  const toggleAutomation = (trackId: string) => {
    setAutomationMode(prev => ({
      ...prev,
      [trackId]: prev[trackId] === "READ" ? "WRITE" : "READ"
    }));
  };

  const toggleSolo = (trackId: string) => {
    setSoloStates(prev => ({
      ...prev,
      [trackId]: !prev[trackId]
    }));
  };

  // Channels to render: A1, A2, A3
  const channels = [
    { id: "track-a1", label: "A1 (Falas)", volKey: "A1" },
    { id: "track-a2", label: "A2 (Música)", volKey: "A2" },
    { id: "track-a3", label: "A3 (FX)", volKey: "A3" }
  ];

  return (
    <div className="bg-neutral-950 p-3 flex flex-col h-full select-none justify-between">
      
      {/* Title block info */}
      <div className="flex items-center justify-between border-b border-neutral-900 pb-1 mb-2">
        <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Mixer de Áudio
        </span>
        <span className="text-[8px] font-mono text-neutral-500">48kHz Auto-Loudness</span>
      </div>

      {/* Grid of channels */}
      <div className="flex-1 flex gap-3 overflow-x-auto min-h-0 text-[10px]">
        
        {/* Render A1, A2, A3 */}
        {channels.map((chan) => {
          const matchingTrack = tracks.find(t => t.id === chan.id) || { volume: 75, muted: false };
          const vol = matchingTrack.volume;
          const isSolo = !!soloStates[chan.id];
          const isMute = matchingTrack.muted || vol === 0;
          const levelPercent = isMute ? 0 : (meters[chan.id] || 0);

          return (
            <div 
              key={chan.id} 
              className="flex-1 min-w-[55px] bg-neutral-900/40 border border-neutral-900 rounded-lg p-1.5 flex flex-col justify-between"
            >
              <div className="text-center font-mono text-[9px] font-black tracking-wide text-neutral-350 uppercase">
                {chan.label.split(" ")[0]}
              </div>

              {/* Vertical core layout: Fader slider & levels meter side-by-side */}
              <div className="flex-1 flex items-center justify-center gap-2 py-1 h-20 relative">
                {/* VU Meter */}
                <div className="w-2 bg-black rounded-sm h-full relative overflow-hidden flex flex-col justify-end p-0.5 border border-neutral-900">
                  <div 
                    className="w-full rounded-sm transition-all duration-75"
                    style={{ 
                      height: `${levelPercent}%`,
                      background: levelPercent > 80 
                        ? 'linear-gradient(to top, #10b981, #eab308, #ef4444)' 
                        : levelPercent > 50
                          ? 'linear-gradient(to top, #10b981, #eab308)' 
                          : '#10b981'
                    }}
                  />
                </div>

                {/* Vertical Slider Fader */}
                <div className="h-full relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={vol}
                    onChange={(e) => onUpdateTrackVolume(chan.id, parseInt(e.target.value))}
                    className="h-16 w-3 accent-teal-400 cursor-ns-resize"
                    style={{ 
                      writingMode: "vertical-lr",
                      direction: "rtl"
                    }}
                  />
                </div>

                <div className="flex flex-col justify-between h-full text-[6px] text-neutral-600 font-mono text-center select-none pointer-events-none">
                  <span>+6</span>
                  <span>0</span>
                  <span>-12</span>
                  <span>-INF</span>
                </div>
              </div>

              {/* Readout value */}
              <div className="text-[8px] font-mono text-teal-400 font-bold text-center bg-black/40 py-0.2 rounded mt-0.5">
                {vol}%
              </div>

              {/* Controls faders row: Mute, Solo, Leitura */}
              <div className="flex gap-0.5 mt-1.5 justify-center">
                <button
                  onClick={() => onUpdateTrackVolume(chan.id, isMute ? 80 : 0)}
                  className={`px-1 py-0.5 text-[8px] rounded font-bold transition-all border ${
                    isMute 
                      ? 'bg-red-950 text-red-500 border-red-500/20' 
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200 border-neutral-700'
                  }`}
                  title="Mudo"
                >
                  M
                </button>
                
                <button
                  onClick={() => toggleSolo(chan.id)}
                  className={`px-1 py-0.5 text-[8px] rounded font-bold transition-all border ${
                    isSolo 
                      ? 'bg-amber-950 text-amber-500 border-amber-500/20' 
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200 border-neutral-700'
                  }`}
                  title="Solo"
                >
                  S
                </button>

                <button
                  onClick={() => toggleAutomation(chan.id)}
                  className={`px-1 py-0.5 text-[7px] rounded font-mono font-bold transition-all border uppercase ${
                    automationMode[chan.id] === 'WRITE' 
                      ? 'bg-teal-950 text-teal-400 border-teal-500/20' 
                      : 'bg-neutral-800 text-neutral-500 border-neutral-750'
                  }`}
                  title="Leitura / Automação"
                >
                  {automationMode[chan.id] === 'READ' ? 'R' : 'W'}
                </button>
              </div>

            </div>
          );
        })}

        {/* MASTER BUS BLOCK */}
        <div 
          className="flex-1 min-w-[65px] bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 border border-teal-500/20 rounded-lg p-1.5 flex flex-col justify-between"
        >
          <div className="text-center font-mono text-[9px] font-black tracking-widest text-teal-400 uppercase">
            MASTER
          </div>

          <div className="flex-1 flex items-center justify-center gap-2 py-1 h-20 relative">
            {/* Peak VU Meter */}
            <div className="w-2.5 bg-black rounded-sm h-full relative overflow-hidden flex flex-col justify-end p-0.5 border border-neutral-850">
              <div 
                className="w-full rounded-sm transition-all duration-75"
                style={{ 
                  height: `${meters["master"] || 0}%`,
                  background: 'linear-gradient(to top, #10b981 0%, #10b981 60%, #fbbf24 80%, #ef4444 100%)'
                }}
              />
            </div>

            {/* Vertical Master Slider fader */}
            <div className="h-full relative flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={project.audioMixer.masterVolume}
                onChange={(e) => onUpdateMasterVolume(parseInt(e.target.value))}
                className="h-16 w-3 accent-teal-400 cursor-ns-resize"
                style={{ 
                  writingMode: "vertical-lr",
                  direction: "rtl"
                }}
              />
            </div>

            <div className="flex flex-col justify-between h-full text-[6px] text-neutral-600 font-mono text-center select-none pointer-events-none">
              <span className="text-red-500 font-bold">CLIP</span>
              <span>0dB</span>
              <span>-12</span>
              <span>-INF</span>
            </div>
          </div>

          {/* Master Readout */}
          <div className="text-[8.5px] font-mono text-white font-extrabold text-center bg-teal-950/20 py-0.2 rounded border border-teal-500/10">
            {project.audioMixer.masterVolume}%
          </div>

          {/* Master Controls */}
          <div className="flex gap-1.5 justify-center">
            <button
              onClick={() => toggleAutomation("master")}
              className={`px-1.5 py-0.5 text-[8px] rounded font-mono font-bold border transition ${
                automationMode["master"] === 'WRITE' 
                  ? 'bg-teal-950 text-teal-400 border-teal-500/20' 
                  : 'bg-neutral-800 text-neutral-400 hover:text-white border-neutral-700'
              }`}
              title="Automação Master"
            >
              {automationMode["master"] === 'READ' ? 'LEITURA' : 'ESC'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
