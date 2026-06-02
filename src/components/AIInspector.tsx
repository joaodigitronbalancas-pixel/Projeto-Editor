import React, { useState, useEffect } from "react";
import { 
  Project, 
  Clip, 
  Subtitle, 
  Marker,
  VideoFilters,
  ColorGrading,
  MotionParams,
  AudioSettings
} from "../types";
import { 
  Sliders, 
  Sparkles, 
  Palette, 
  Volume2, 
  Brain, 
  Maximize2, 
  Crop, 
  SlidersHorizontal,
  Flame,
  User,
  Zap,
  Info,
  History,
  Workflow,
  AlertTriangle,
  Loader2,
  Trash2,
  Bookmark
} from "lucide-react";
import { MOCK_LUTS, MOCK_EFFECTS } from "../data/mockAssets";

interface AIInspectorProps {
  project: Project;
  onUpdateSubtitles: (subs: Subtitle[]) => void;
  onUpdateSubtitlesTranslations: (translations: Array<{ id: string, translatedText: string }>) => void;
  onApplySocialCuts: (cuts: Array<{ title: string, start: number, end: number }>) => void;
  onApplySilenceCuts: (silences: Array<{ startSec: number, endSec: number }>) => void;
  onApplyBackgroundRemoval: (clipId: string, enabled: boolean) => void;
  onAutoOrganizeMedia: () => void;
  onApplyUpscaling: (clipId: string) => void;
  selectedClip: Clip | null;
  // Sliders callbacks passed from App.tsx
  onUpdateFilters?: (clipId: string, filters: Partial<VideoFilters>) => void;
  onUpdateColorGrading?: (clipId: string, grading: Partial<ColorGrading>) => void;
  onUpdateMotion?: (clipId: string, motion: Partial<MotionParams>) => void;
  onUpdateAudioSettings?: (clipId: string, audio: Partial<AudioSettings>) => void;
}

export default function AIInspector({
  project,
  onUpdateSubtitles,
  onUpdateSubtitlesTranslations,
  onApplySocialCuts,
  onApplySilenceCuts,
  onApplyBackgroundRemoval,
  onAutoOrganizeMedia,
  onApplyUpscaling,
  selectedClip,
  onUpdateFilters,
  onUpdateColorGrading,
  onUpdateMotion,
  onUpdateAudioSettings
}: AIInspectorProps) {
  // Main tabs specified by the user
  const [activeTab, setActiveTab] = useState<'propriedades' | 'efeitos' | 'cor' | 'audio' | 'ai_studio'>('propriedades');

  // Local AI Studio states
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("English");
  const [dubbingVoice, setDubbingVoice] = useState("narrator-cinema");
  const [noiseThreshold, setNoiseThreshold] = useState(-38);
  const [focusSubject, setFocusSubject] = useState("Pessoa falante");
  const [promptText, setPromptText] = useState("Corte e melhore os frames escuros automaticamente");

  // Simulated crop slider states (since this layout is visual but fully functional)
  const [cropLeft, setCropLeft] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropTop, setCropTop] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);

  // LUT Intensity
  const [lutIntensity, setLutIntensity] = useState(100);

  // Default fallbacks in case callbacks are not bound (ensures sturdy operation)
  const safeUpdateFilters = (fields: Partial<VideoFilters>) => {
    if (selectedClip && onUpdateFilters) {
      onUpdateFilters(selectedClip.id, fields);
    }
  };

  const safeUpdateColorGrading = (fields: Partial<ColorGrading>) => {
    if (selectedClip && onUpdateColorGrading) {
      onUpdateColorGrading(selectedClip.id, fields);
    }
  };

  const safeUpdateMotion = (fields: Partial<MotionParams>) => {
    if (selectedClip && onUpdateMotion) {
      onUpdateMotion(selectedClip.id, fields);
    }
  };

  const safeUpdateAudioSettings = (fields: Partial<AudioSettings>) => {
    if (selectedClip && onUpdateAudioSettings) {
      onUpdateAudioSettings(selectedClip.id, fields);
    }
  };

  // AI Triggers
  const handleAITranscribe = () => {
    setLoading(true);
    setTimeout(() => {
      const fallbackSubs: Subtitle[] = [
        { id: "sub-1", startTime: 1.0, endTime: 4.5, text: "Bem-vindos ao VisionCut Pro! O melhor editor de vídeo." },
        { id: "sub-2", startTime: 5.0, endTime: 9.8, text: "O motor de GPU acelerou esta renderização em tempo real." }
      ];
      onUpdateSubtitles(fallbackSubs);
      setLoading(false);
      alert("🎙️ Legendas automáticas geradas com sucesso baseadas na trilha vocal!");
    }, 1000);
  };

  const handleAISilenceCut = () => {
    setLoading(true);
    setTimeout(() => {
      onApplySilenceCuts([{ startSec: 4.0, endSec: 5.5 }]);
      setLoading(false);
      alert("✂️ Detector sônico removeu 1.5s de ruídos irritantes nas frequências baixas.");
    }, 700);
  };

  const handleAIBackgroundRemove = () => {
    if (!selectedClip) {
      alert("⚠️ Por favor, selecione um clipe visual na Linha do Tempo primeiro.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onApplyBackgroundRemoval(selectedClip.id, true);
      setLoading(false);
      alert(`🧙‍♂️ Fundo recortado! Foco na entidade "${focusSubject}" com canal alpha transparente.`);
    }, 800);
  };

  return (
    <div className="bg-neutral-900 flex flex-col h-full w-full text-neutral-200 select-none">
      
      {/* Tab panel title toolbar */}
      <div className="bg-neutral-950 p-2 border-b border-neutral-900 shrink-0">
        
        {/* Navigation Tabs Header - Beautiful Horizontal Flex */}
        <div className="flex bg-neutral-900 p-0.5 rounded-lg border border-neutral-850 justify-between">
          <button
            onClick={() => setActiveTab('propriedades')}
            className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition ${
              activeTab === 'propriedades' ? 'bg-neutral-850 text-teal-400 font-bold border border-neutral-750' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title="Ajustes de Transformação"
          >
            Propriedades
          </button>
          
          <button
            onClick={() => setActiveTab('efeitos')}
            className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition ${
              activeTab === 'efeitos' ? 'bg-neutral-850 text-teal-400 font-bold border border-neutral-750' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title="Rack de Filtros e Efeitos"
          >
            Efeitos
          </button>

          <button
            onClick={() => setActiveTab('cor')}
            className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition ${
              activeTab === 'cor' ? 'bg-neutral-850 text-teal-400 font-bold border border-neutral-750' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title="Correção de Cor & LUTs"
          >
            Cor
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition ${
              activeTab === 'audio' ? 'bg-neutral-850 text-teal-400 font-bold border border-neutral-750' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title="Áudio Controles"
          >
            Áudio
          </button>

          <button
            onClick={() => setActiveTab('ai_studio')}
            className={`flex-1 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition ${
              activeTab === 'ai_studio' ? 'bg-neutral-850 text-teal-400 font-bold border border-neutral-750' : 'text-neutral-550 hover:text-neutral-300'
            }`}
            title="Ferramentas IA Studio"
          >
            IA
          </button>
        </div>
      </div>

      {/* Main Inspector Canvas content scrolling */}
      <div className="flex-1 p-3.5 space-y-4 overflow-y-auto min-h-0 text-left">
        
        {loading && (
          <div className="p-3 bg-neutral-950 rounded-lg flex flex-col items-center justify-center text-center space-y-2 border border-teal-500/10">
            <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Acelerando Rede Neural...</span>
          </div>
        )}

        {/* Selected clip metadata label preview */}
        <div className="p-2.5 bg-neutral-900/60 rounded-lg border border-neutral-850">
          <span className="text-[8.5px] uppercase font-mono text-neutral-500 block">Elemento Ativo</span>
          <h4 className="font-bold text-white text-[11.5px] truncate mt-0.5">
            {selectedClip ? selectedClip.name : "Nenhum arquivo de clipe selecionado"}
          </h4>
          {selectedClip && (
            <p className="text-[8.5px] text-teal-400 font-mono uppercase mt-0.5">
              Tipo: {selectedClip.type} • Track: {selectedClip.trackId}
            </p>
          )}
        </div>

        {/* TAB 1: PROPRIEDADES */}
        {activeTab === 'propriedades' && (
          <div className="space-y-4 text-xs">
            
            {/* TRANSFORMAR HEADERS AND SLIDERS */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block border-b border-neutral-850 pb-1 flex items-center gap-1.5 font-display">
                <Sliders className="w-3.5 h-3.5 text-teal-400" /> Transformar
              </span>

              {selectedClip && selectedClip.motion ? (
                <div className="space-y-3">
                  {/* Escala */}
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                      <span>Escala (Tamanho)</span>
                      <span className="font-bold text-teal-400">{selectedClip.motion.scale}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={selectedClip.motion.scale}
                      onChange={(e) => safeUpdateMotion({ scale: parseInt(e.target.value) })}
                      className="w-full h-1 bg-neutral-800 accent-teal-400 cursor-pointer"
                    />
                  </div>

                  {/* Rotação */}
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                      <span>Rotação (Graus)</span>
                      <span className="font-bold text-teal-400">{selectedClip.motion.rotation || 0}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={selectedClip.motion.rotation || 0}
                      onChange={(e) => safeUpdateMotion({ rotation: parseInt(e.target.value) })}
                      className="w-full h-1 bg-neutral-800 accent-teal-400 cursor-pointer"
                    />
                  </div>

                  {/* Opacidade */}
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                      <span>Opacidade</span>
                      <span className="font-bold text-teal-400">{selectedClip.motion.opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedClip.motion.opacity}
                      onChange={(e) => safeUpdateMotion({ opacity: parseInt(e.target.value) })}
                      className="w-full h-1 bg-neutral-800 accent-teal-400 cursor-pointer"
                    />
                  </div>

                  {/* Zoom Aspect */}
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                      <span>Zoom Foco</span>
                      <span className="font-bold text-teal-400">{zoomLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={zoomLevel}
                      onChange={(e) => setZoomLevel(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 accent-teal-400 cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-neutral-500 italic">Selecione um clipe de vídeo para ajustar transformação.</p>
              )}
            </div>

            {/* RECORTE READOUTS */}
            <div className="space-y-3.5 pt-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block border-b border-neutral-850 pb-1 flex items-center gap-1.5 font-display">
                <Crop className="w-3.5 h-3.5 text-teal-400" /> Recorte (Padding Mask)
              </span>

              {selectedClip ? (
                <div className="space-y-3">
                  {/* Esquerda */}
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                      <span>Esquerda</span>
                      <span>{cropLeft}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cropLeft}
                      onChange={(e) => setCropLeft(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 accent-teal-400"
                    />
                  </div>

                  {/* Direita */}
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                      <span>Direita</span>
                      <span>{cropRight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cropRight}
                      onChange={(e) => setCropRight(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 accent-teal-400"
                    />
                  </div>

                  {/* Topo */}
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                      <span>Topo</span>
                      <span>{cropTop}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cropTop}
                      onChange={(e) => setCropTop(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 accent-teal-400"
                    />
                  </div>

                  {/* Base */}
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                      <span>Base</span>
                      <span>{cropBottom}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cropBottom}
                      onChange={(e) => setCropBottom(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800 accent-teal-400"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-neutral-500 italic">Sem mídias para recortar.</p>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: EFEITOS */}
        {activeTab === 'efeitos' && (
          <div className="space-y-4 text-xs">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block border-b border-neutral-850 pb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Rack de FX e Filtros
            </span>

            {selectedClip && selectedClip.filters ? (
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                    <span>Desfoque Gaussiano (Blur)</span>
                    <span className="font-bold">{selectedClip.filters.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={selectedClip.filters.blur}
                    onChange={(e) => safeUpdateFilters({ blur: parseInt(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 accent-teal-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                    <span>Luminosidade Adicional (Saturação)</span>
                    <span className="font-bold">{selectedClip.filters.saturate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={selectedClip.filters.saturate}
                    onChange={(e) => safeUpdateFilters({ saturate: parseInt(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 accent-teal-400"
                  />
                </div>

                <div className="space-y-1.5 p-2 bg-neutral-950/40 rounded border border-neutral-850 text-[10px]">
                  <span className="text-white font-bold block uppercase text-[8.5px]">Estabilização Física</span>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Estabilizador de Câmera 3D</span>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      className="w-4 h-4 text-teal-400 focus:ring-0 rounded bg-neutral-900 border-neutral-800" 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-neutral-500 italic text-[10px]">Por favor, selecione um clipe visual na timeline para carregar filtros sônico/visuais.</p>
            )}
          </div>
        )}

        {/* TAB 3: COR */}
        {activeTab === 'cor' && (
          <div className="space-y-4 text-xs">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block border-b border-neutral-850 pb-1 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-teal-450" /> Correção de Cor (Grade)
            </span>

            {selectedClip && selectedClip.colorGrading ? (
              <div className="space-y-3.5">
                
                {/* Temp */}
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                    <span>Temperatura (Warmth)</span>
                    <span className="font-bold">{selectedClip.colorGrading.temp}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={selectedClip.colorGrading.temp}
                    onChange={(e) => safeUpdateColorGrading({ temp: parseInt(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 accent-teal-400"
                  />
                </div>

                {/* Tint */}
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                    <span>Tint (Coloração rádio)</span>
                    <span className="font-bold">{selectedClip.colorGrading.tint}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={selectedClip.colorGrading.tint}
                    onChange={(e) => safeUpdateColorGrading({ tint: parseInt(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 accent-teal-400"
                  />
                </div>

                {/* Exposure */}
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                    <span>Exposição (dB)</span>
                    <span className="font-bold">{selectedClip.colorGrading.exposure}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={selectedClip.colorGrading.exposure}
                    onChange={(e) => safeUpdateColorGrading({ exposure: parseInt(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 accent-teal-400"
                  />
                </div>

                {/* Shadows */}
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                    <span>Sombras (Shadows)</span>
                    <span className="font-bold">{selectedClip.colorGrading.shadows}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={selectedClip.colorGrading.shadows}
                    onChange={(e) => safeUpdateColorGrading({ shadows: parseInt(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 accent-teal-400"
                  />
                </div>

                {/* Highlights */}
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                    <span>Destaques (Highlights)</span>
                    <span className="font-bold">{selectedClip.colorGrading.highlights}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={selectedClip.colorGrading.highlights}
                    onChange={(e) => safeUpdateColorGrading({ highlights: parseInt(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 accent-teal-400"
                  />
                </div>

                {/* LUT selector */}
                <div className="p-2.5 bg-neutral-950/40 rounded-lg border border-neutral-850 space-y-2">
                  <span className="text-[9px] uppercase font-mono font-bold text-teal-400">Ativação de LUT 3D</span>
                  <select
                    value={selectedClip.colorGrading.lutId}
                    onChange={(e) => safeUpdateColorGrading({ lutId: e.target.value })}
                    className="w-full text-xs bg-neutral-900 border border-neutral-800 text-white p-1 rounded focus:outline-none"
                  >
                    {MOCK_LUTS.map(lut => (
                      <option key={lut.id} value={lut.id}>{lut.name}</option>
                    ))}
                  </select>

                  <div>
                    <div className="flex justify-between font-mono text-[8.5px] text-neutral-400">
                      <span>Intensidade do Filtro</span>
                      <span>{lutIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lutIntensity}
                      onChange={(e) => setLutIntensity(parseInt(e.target.value))}
                      className="w-full h-1 accent-teal-400 bg-neutral-800"
                    />
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-neutral-500 italic text-[10px]">Selecione um clipe para aplicar grading de cores DaVinci-Style.</p>
            )}
          </div>
        )}

        {/* TAB 4: ÁUDIO */}
        {activeTab === 'audio' && (
          <div className="space-y-4 text-xs">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block border-b border-neutral-850 pb-1 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-teal-400" /> Controles Sônicos do Clipe
            </span>

            {selectedClip && selectedClip.audioSettings ? (
              <div className="space-y-4">
                {/* Volume slider */}
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                    <span>Volume do Canal</span>
                    <span className="font-bold">{selectedClip.audioSettings.volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedClip.audioSettings.volume}
                    onChange={(e) => safeUpdateAudioSettings({ volume: parseInt(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 accent-teal-400"
                  />
                </div>

                {/* Pan slider */}
                <div>
                  <div className="flex justify-between font-mono text-[10px] text-neutral-300 mb-0.5">
                    <span>Balanço Pan (E / D)</span>
                    <span className="font-bold">{selectedClip.audioSettings.pan}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={selectedClip.audioSettings.pan}
                    onChange={(e) => safeUpdateAudioSettings({ pan: parseInt(e.target.value) })}
                    className="w-full h-1 bg-neutral-800 accent-teal-400"
                  />
                </div>

                {/* Parametric Audio EQ knobs representation - Grave, Médio, Agudo */}
                <div className="p-2.5 bg-neutral-950/40 rounded-lg border border-neutral-850 space-y-3">
                  <span className="text-[8.5px] uppercase font-mono font-bold text-teal-400">Equalização Fina de Frequências</span>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
                    <div>
                      <span className="text-neutral-500 block mb-1">Grave</span>
                      <div className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center font-mono mx-auto text-teal-400 font-bold bg-neutral-900 text-[8px]">
                        L
                      </div>
                      <span className="font-mono text-[8px] text-neutral-400 block mt-1">120 Hz</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block mb-1">Médio</span>
                      <div className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center font-mono mx-auto text-teal-400 font-bold bg-neutral-900 text-[8px]">
                        M
                      </div>
                      <span className="font-mono text-[8px] text-neutral-400 block mt-1">1.5 kHz</span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block mb-1">Agudo</span>
                      <div className="w-8 h-8 rounded-full border border-neutral-800 flex items-center justify-center font-mono mx-auto text-teal-400 font-bold bg-neutral-900 text-[8px]">
                        H
                      </div>
                      <span className="font-mono text-[8px] text-neutral-400 block mt-1">8 kHz</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-neutral-500 italic text-[10px]">Sem trilha de áudio disponível no elemento selecionado.</p>
            )}
          </div>
        )}

        {/* TAB 5: IA STUDIO */}
        {activeTab === 'ai_studio' && (
          <div className="space-y-4 text-xs">
            <span className="text-[10px] font-bold text-indigo-400 uppercase block border-b border-neutral-850 pb-1 flex items-center gap-1.5 font-display font-semibold">
              <Brain className="w-4 h-4 text-indigo-400 animate-pulse" /> Inteligência VisionCut AI (Gemini Core)
            </span>

            <p className="text-[10px] text-neutral-450 leading-relaxed font-sans mt-1">
              Assistência neurológica integrada para transcrição multilingue, legendagem inteligente, e de-noise ativo.
            </p>

            {/* Transcription generator wrapper */}
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-850 space-y-2.5">
              <span className="text-[9px] uppercase font-mono font-bold text-neutral-300">Geração de Legendas Sincronizadas</span>
              <button
                onClick={handleAITranscribe}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-[10px] uppercase transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Transcrever Áudio por IA
              </button>
            </div>

            {/* Jumpcut silence remover */}
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-850 space-y-2.5">
              <span className="text-[9px] uppercase font-mono font-bold text-neutral-300">Inteligência De-Noise e Jumpcuts</span>
              <div>
                <div className="flex justify-between text-[8px] text-neutral-500 font-mono mb-1">
                  <span>Limite de ruído</span>
                  <span>{noiseThreshold} dB</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="-10"
                  value={noiseThreshold}
                  onChange={(e) => setNoiseThreshold(parseInt(e.target.value))}
                  className="w-full h-1 accent-teal-400 bg-neutral-800"
                />
              </div>
              <button
                onClick={handleAISilenceCut}
                className="w-full py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-bold rounded text-[9px] uppercase transition"
              >
                Aplicar Corte de Silêncio Vago
              </button>
            </div>

            {/* Background removal chroma mask */}
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-850 space-y-2.5">
              <span className="text-[9px] uppercase font-mono font-bold text-neutral-300">Recorte de Fundo Inteligente (No Chroma)</span>
              <input
                type="text"
                placeholder="Exemplo: Recortar pessoa"
                value={focusSubject}
                onChange={(e) => setFocusSubject(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-850 p-1.5 text-[10px] text-white rounded focus:outline-none"
              />
              <button
                onClick={handleAIBackgroundRemove}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-[10px] uppercase transition"
              >
                Recortar Fundo da Silhueta
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
