import React, { useState } from "react";
import { Track, Clip, Marker, Subtitle } from "../types";
import { 
  Scissors, 
  Magnet, 
  Trash2, 
  Split, 
  ZoomIn, 
  Plus, 
  ChevronRight,
  EyeOff, 
  VolumeX, 
  Link2,
  Lock,
  Unlock,
  MoveHorizontal,
  Bookmark,
  GitCommit
} from "lucide-react";

interface TimelineProps {
  tracks: Track[];
  clips: Clip[];
  markers: Marker[];
  subtitles: Subtitle[];
  currentTime: number;
  onSetCurrentTime: (time: number) => void;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onSplitClip: (clipId: string, time: number) => void;
  onMergeClips: () => void;
  onDeleteClip: (clipId: string) => void;
  onAddMarker: (time: number, label: string) => void;
  snapEnabled: boolean;
  onToggleSnap: () => void;
  editMode: 'standard' | 'ripple' | 'rolling' | 'slip';
  onChangeEditMode: (mode: 'standard' | 'ripple' | 'rolling' | 'slip') => void;
  onUpdateClipPosition: (clipId: string, start: number) => void;
}

export default function Timeline({
  tracks,
  clips,
  markers,
  subtitles,
  currentTime,
  onSetCurrentTime,
  selectedClipId,
  onSelectClip,
  onSplitClip,
  onMergeClips,
  onDeleteClip,
  onAddMarker,
  snapEnabled,
  onToggleSnap,
  editMode,
  onChangeEditMode,
  onUpdateClipPosition
}: TimelineProps) {
  // Zoom level multiplier: converts seconds to pixels (e.g., 10 means 1s = 10px)
  const [zoomLevel, setZoomLevel] = useState(15);
  const [verticalZoom, setVerticalZoom] = useState(56);
  const [showAddMarkerPrompt, setShowAddMarkerPrompt] = useState(false);
  const [newMarkerLabel, setNewMarkerLabel] = useState("");

  const maxTimelineDuration = 60.0; // Total canvas limit is 60 seconds for performance

  // Generate ticks for timeline rule
  const renderRuler = () => {
    const ticks = [];
    const step = zoomLevel < 10 ? 5 : zoomLevel < 20 ? 2 : 1; // tick interval in seconds
    for (let i = 0; i <= maxTimelineDuration; i += step) {
      ticks.push(
        <div 
          key={i} 
          className="absolute border-l border-neutral-700 h-3 text-[9px] text-neutral-500 font-mono pl-1 select-none pointer-events-none"
          style={{ left: `${i * zoomLevel}px` }}
        >
          {i}s
        </div>
      );
    }
    return ticks;
  };

  const handleTimelineScrubClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    let clickTime = clickX / zoomLevel;
    
    // Magnetic Snap Calculation
    if (snapEnabled) {
      let closestTime = clickTime;
      let minDiff = 1.25; // snap threshold in seconds based on zoom
      
      // Snap to adjacent clips
      clips.forEach(clip => {
        const clipEnd = clip.start + clip.duration;
        if (Math.abs(clip.start - clickTime) < minDiff) {
          closestTime = clip.start;
          minDiff = Math.abs(clip.start - clickTime);
        }
        if (Math.abs(clipEnd - clickTime) < minDiff) {
          closestTime = clipEnd;
          minDiff = Math.abs(clipEnd - clickTime);
        }
      });

      // Snap to markers
      markers.forEach(mk => {
        if (Math.abs(mk.time - clickTime) < minDiff) {
          closestTime = mk.time;
          minDiff = Math.abs(mk.time - clickTime);
        }
      });

      clickTime = closestTime;
    }

    onSetCurrentTime(Math.max(0, Math.min(maxTimelineDuration, clickTime)));
  };

  const handleAddMarkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarkerLabel.trim()) return;
    onAddMarker(currentTime, newMarkerLabel);
    setNewMarkerLabel("");
    setShowAddMarkerPrompt(false);
  };

  const selectedClipObj = clips.find(c => c.id === selectedClipId);

  return (
    <div className="bg-neutral-900 flex flex-col flex-1 h-full min-h-0 select-none overflow-hidden">
      {/* Timeline Controls Header bar */}
      <div className="bg-neutral-950 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between gap-3 flex-wrap">
        
        {/* Dynamic Tool Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Snap Trigger */}
          <button
            onClick={onToggleSnap}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${snapEnabled ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' : 'bg-neutral-900 text-neutral-500 border border-neutral-800 hover:text-neutral-300'}`}
            title="Snapeamento Magnético Inteligente"
          >
            <Magnet className="w-4 h-4" />
            <span>SNAP</span>
          </button>

          <span className="w-px h-5 bg-neutral-800 mx-1"></span>

          {/* Edit Mode Presets */}
          <div className="flex items-center bg-neutral-900 p-0.5 rounded border border-neutral-800 gap-0.5">
            {(['standard', 'ripple', 'rolling', 'slip'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onChangeEditMode(mode)}
                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition ${editMode === mode ? 'bg-teal-500 text-neutral-950 font-bold' : 'text-neutral-500 hover:text-neutral-300'}`}
                title={`Modologia de Edição: ${mode === 'standard' ? 'Padrão' : mode === 'ripple' ? 'Ajuste Ripple (Une clipes)' : mode === 'rolling' ? 'Ajuste Rolling (Tamanho fixo)' : 'Ajuste Slip (Deslocamento interno)'}`}
              >
                {mode}
              </button>
            ))}
          </div>

          <span className="w-px h-5 bg-neutral-800 mx-1"></span>

          {/* Action Operations */}
          <button
            disabled={!selectedClipId}
            onClick={() => {
              if (selectedClipId) onSplitClip(selectedClipId, currentTime);
            }}
            className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 disabled:opacity-40 text-teal-400 font-semibold text-xs rounded transition flex items-center gap-1.5"
            title="Separar clipe selecionado na agulha atual (S)"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>DIVIDIR (S)</span>
          </button>

          <button
            onClick={onMergeClips}
            className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-teal-400 font-semibold text-xs rounded transition flex items-center gap-1.5"
            title="Une clipes adjacentes do mesmo tipo na pista"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>JUNÇÃO</span>
          </button>

          <button
            disabled={!selectedClipId}
            onClick={() => {
              if (selectedClipId) onDeleteClip(selectedClipId);
            }}
            className="px-2.5 py-1.5 bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 disabled:opacity-40 text-red-400 font-semibold text-xs rounded transition flex items-center gap-1"
            title="Remover clipe selecionado (Delete)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Marker & Zoom Slider controls */}
        <div className="flex items-center gap-3.5 flex-wrap">
          <button
            onClick={() => setShowAddMarkerPrompt(!showAddMarkerPrompt)}
            className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white rounded text-xs flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-teal-400" />
            <span>+ MARCADOR</span>
          </button>

          {/* Ajuste Dinâmico */}
          <button
            onClick={() => {
              if (clips.length > 0) {
                const maxTime = Math.max(...clips.map(c => c.start + c.duration), 5);
                const idealZoom = Math.max(5, Math.min(40, Math.floor(650 / maxTime)));
                setZoomLevel(idealZoom);
                setVerticalZoom(56);
              } else {
                setZoomLevel(15);
                setVerticalZoom(56);
              }
            }}
            className="px-2 py-1 bg-indigo-950/40 text-indigo-400 hover:bg-indigo-900/40 hover:text-white border border-indigo-500/25 rounded text-xs font-black uppercase tracking-wider transition"
            title="Ajuste Dinâmico: Ajusta escala para caber todo o conteúdo da timeline na tela"
          >
            Ajuste Dinâmico
          </button>

          {/* Zoom Horizontal */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-mono text-neutral-500">ZOOM HORIZ:</span>
            <input
              type="range"
              min="5"
              max="40"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseInt(e.target.value))}
              className="w-16 accent-teal-400 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
              title="Zoom de Escala de Tempo"
            />
            <span className="text-[10px] font-mono text-neutral-500 select-none">{zoomLevel}x</span>
          </div>

          {/* Zoom Vertical */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-mono text-neutral-500">ZOOM VERT:</span>
            <input
              type="range"
              min="30"
              max="110"
              value={verticalZoom}
              onChange={(e) => setVerticalZoom(parseInt(e.target.value))}
              className="w-16 accent-teal-400 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
              title="Ajustar Altura das Faixas (Vertical Zoom)"
            />
            <span className="text-[10px] font-mono text-neutral-500 select-none">{verticalZoom}px</span>
          </div>
        </div>

      </div>

      {/* Marker Creation Overlay form dialog */}
      {showAddMarkerPrompt && (
        <form onSubmit={handleAddMarkerSubmit} className="bg-neutral-950 p-2 border-b border-teal-500/20 flex gap-2 items-center animate-fade-in px-4">
          <span className="text-xs text-teal-300 font-medium">Marcador em {currentTime.toFixed(1)}s:</span>
          <input
            type="text"
            required
            placeholder="Ex: Introdução, Efeito Boom..."
            value={newMarkerLabel}
            onChange={(e) => setNewMarkerLabel(e.target.value)}
            className="px-2 py-1 bg-neutral-900 border border-neutral-700 text-xs text-white rounded focus:outline-none focus:border-teal-400 flex-1"
          />
          <button type="submit" className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-neutral-900 font-bold text-xs rounded transition">
            Gravar
          </button>
          <button type="button" onClick={() => setShowAddMarkerPrompt(false)} className="px-2 py-1 text-xs text-neutral-500 hover:text-white">
            Cancelar
          </button>
        </form>
      )}

      {/* Core Tracks Canvas wrapper divided into Header (Left) and Content Scroll (Right) */}
      <div className="flex-1 flex overflow-y-auto overflow-x-hidden">
        
        {/* Track Control Panels Header Column (Left Side) */}
        <div className="w-[100px] bg-neutral-950 border-r border-[#1e1e1e] shrink-0 divide-y divide-neutral-900 text-[10px] select-none uppercase font-bold text-neutral-400">
          {/* Rules spacer */}
          <div className="h-8 bg-neutral-950 sticky top-0 z-10 flex items-center justify-center border-b border-neutral-800 text-neutral-500 text-[8.5px] font-mono tracking-wider">
            TRACKS
          </div>

          {tracks.map((track) => (
            <div 
              key={track.id} 
              style={{ height: `${verticalZoom}px` }} 
              className="p-1.5 bg-neutral-950 hover:bg-neutral-900 transition flex flex-col justify-center gap-1 border-b border-neutral-900"
            >
              <div className="flex items-center justify-between">
                <span className="truncate text-teal-400 text-[9.5px] font-black tracking-wide" title={track.name}>
                  {track.id.toUpperCase()}
                </span>
                <span className="text-[7px] bg-neutral-900 text-neutral-500 px-1 py-0.2 rounded font-mono font-normal">
                  {track.type}
                </span>
              </div>

              {verticalZoom >= 46 && (
                <div className="flex items-center gap-2 text-neutral-600 mt-1">
                  <button onClick={() => {}} className="p-0.5 hover:text-white rounded" title="Ocultar">
                    <EyeOff className="w-3 h-3 text-neutral-500 hover:text-teal-400 transition" />
                  </button>
                  <button onClick={() => {}} className="p-0.5 hover:text-white rounded" title="Travar">
                    <Lock className="w-3 h-3 text-neutral-505 hover:text-teal-400 transition" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Channels Clip Content Scrollable Timelines (Right Side) */}
        <div className="flex-1 overflow-x-auto relative min-h-60" onClick={handleTimelineScrubClick}>
          
          {/* Visual ruler overlay row */}
          <div className="h-8 bg-neutral-950/60 sticky top-0 z-15 border-b border-neutral-800 relative w-[2400px]">
            {renderRuler()}
            
            {/* Markers on Ruler */}
            {markers.map((mk) => (
              <div
                key={mk.id}
                className="absolute top-1 select-none pointer-events-auto group cursor-pointer z-35"
                style={{ left: `${mk.time * zoomLevel}px` }}
                title={`${mk.label} (${mk.time}s)`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSetCurrentTime(mk.time);
                }}
              >
                <div className="w-2.5 h-2.5 rotate-45 border border-white" style={{ backgroundColor: mk.color }} />
                <span className="absolute left-3 top-[-2px] hidden group-hover:block bg-neutral-950 text-[10px] text-teal-400 font-mono px-1.5 py-0.5 rounded shadow-lg border border-neutral-800 whitespace-nowrap z-40">
                  {mk.label} ({mk.time}s)
                </span>
              </div>
            ))}
          </div>

          {/* Tracks Lanes */}
          <div className="divide-y divide-neutral-800 relative w-[2400px]">
            {tracks.map((track) => {
              const trackClips = clips.filter(c => c.trackId === track.id);
              
              return (
                <div 
                  key={track.id} 
                  style={{ height: `${verticalZoom}px` }} 
                  className="bg-neutral-900/20 relative border-b border-neutral-900/40"
                >
                  
                  {/* Subtle seconds background lines */}
                  {Array.from({ length: 60 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute border-l border-neutral-800/40 h-full pointer-events-none select-none"
                      style={{ left: `${i * zoomLevel}px` }}
                    />
                  ))}

                  {/* Clips list on current track */}
                  {trackClips.map((clip) => {
                    const isSelected = clip.id === selectedClipId;
                    const widthPixels = clip.duration * zoomLevel;
                    const leftPixels = clip.start * zoomLevel;

                    return (
                      <div
                        key={clip.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectClip(clip.id);
                        }}
                        className={`absolute top-1.5 bottom-1.5 rounded-lg border px-2.5 py-1 transition flex flex-col justify-center tracking-wide cursor-pointer text-xs font-semibold overflow-hidden group select-none shadow ${
                          isSelected 
                            ? 'border-yellow-400 bg-yellow-500/10 text-yellow-300 ring-2 ring-yellow-400/30' 
                            : 'border-white/10 hover:border-white/30 text-white'
                        }`}
                        style={{
                          left: `${leftPixels}px`,
                          width: `${widthPixels}px`,
                          backgroundColor: `${clip.color}35`, // dynamic transparency color
                          borderLeftWidth: '5px',
                          borderLeftColor: clip.color
                        }}
                      >
                        <div className="flex items-center justify-between text-[11px] truncate select-none leading-none">
                          <span className="font-bold truncate select-none">{clip.name}</span>
                        </div>

                        {/* Slip indicator readouts - adaptive height rendering */}
                        {verticalZoom >= 46 && (
                          <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono mt-0.5 opacity-70">
                            <span>Dur: {clip.duration.toFixed(1)}s</span>
                            {editMode === 'slip' && isSelected && (
                              <span className="text-yellow-400">Slip: {clip.sourceStart.toFixed(1)}s</span>
                            )}
                          </div>
                        )}

                        {/* Interactive Drag Handles - clicking them allows simulated sliding of edge boundaries */}
                        <button 
                          className="absolute right-0 top-0 bottom-0 w-1 bg-white/20 hover:bg-teal-400 cursor-ew-resize opacity-0 group-hover:opacity-100 transition"
                          title="Arraste para cortar extremidades"
                        />
                        <button 
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 hover:bg-teal-400 cursor-ew-resize opacity-0 group-hover:opacity-100 transition"
                          title="Arraste para alterar o início"
                        />
                      </div>
                    );
                  })}

                </div>
              );
            })}
          </div>

          {/* RED TIMELINE SCRUBBER Playhead Needle */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-red-500 z-30 pointer-events-none transition-all duration-75"
            style={{ 
              left: `${currentTime * zoomLevel}px`,
              boxShadow: "0 0 8px #ef4444"
            }}
          >
            <div className="w-3 h-3 bg-red-500 rotate-45 absolute -top-1.5 -left-1.5 border border-white" />
          </div>

        </div>

      </div>
    </div>
  );
}
