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
  Bookmark,
  Type,
  Maximize,
  Compass,
  Star,
  RefreshCw,
  Search,
  CheckCircle,
  Scissors
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
  onUpdateClipText?: (clipId: string, text: string) => void;
  activeTabOverride?: 'transformacao' | 'cor' | 'audio' | 'texto' | 'motion' | 'ai';
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
  onUpdateAudioSettings,
  onUpdateClipText,
  activeTabOverride
}: AIInspectorProps) {
  // Navigation Tabs specified by Product Requirements
  const [activeTab, setActiveTab] = useState<'transformacao' | 'cor' | 'audio' | 'texto' | 'motion' | 'ai'>('transformacao');

  // Sync with workspace layout mode
  useEffect(() => {
    if (activeTabOverride) {
      setActiveTab(activeTabOverride);
    }
  }, [activeTabOverride]);

  // Local state variables for comprehensive properties
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favEffects, setFavEffects] = useState<string[]>(["blur"]);
  const [activeEffectTab, setActiveEffectTab] = useState<'video' | 'audio' | 'motion' | 'ia' | 'luts' | 'vfx'>('video');

  // Properties extra parameters
  const [anchorX, setAnchorX] = useState(0);
  const [anchorY, setAnchorY] = useState(0);
  const [blendMode, setBlendMode] = useState('normal');
  const [cropLeft, setCropLeft] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropTop, setCropTop] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);
  const [shadowOpacity, setShadowOpacity] = useState(30);
  const [shadowDepth, setShadowDepth] = useState(8);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [glowRadius, setGlowRadius] = useState(15);

  // DaVinci wheels interactive coordinates simulation
  const [liftJoy, setLiftJoy] = useState({ x: 0, y: 0 });
  const [gammaJoy, setGammaJoy] = useState({ x: 0, y: 0 });
  const [gainJoy, setGainJoy] = useState({ x: 0, y: 0 });
  const [activeWheel, setActiveWheel] = useState<'lift' | 'gamma' | 'gain'>('gamma');

  // Text state
  const [subtitleSearch, setSubtitleSearch] = useState("");
  const [textStyleFont, setTextStyleFont] = useState("Inter");
  const [textStyleSize, setTextStyleSize] = useState(24);
  const [textStyleColor, setTextStyleColor] = useState("#ffffff");
  const [textStyleBg, setTextStyleBg] = useState("rgba(0,0,0,0.85)");
  const [textStyleAlign, setTextStyleAlign] = useState<'left' | 'center' | 'right'>('center');

  // Motion Keyframe tracking simulation
  const [keyframes, setKeyframes] = useState<number[]>([1.5, 4.2]);
  const [selectedKeyframe, setSelectedKeyframe] = useState<number | null>(null);

  // AI Panel states
  const [aiTargetLang, setAiTargetLang] = useState("pt-BR");
  const [aiDubbingVoice, setAiDubbingVoice] = useState("cinema-male");
  const [smartReframeMode, setSmartReframeMode] = useState("9:16 Auto");
  const [voiceEnhanceIntensity, setVoiceEnhanceIntensity] = useState(80);

  // Safe callback updators
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

  // AI Operations
  const triggerAILegend = () => {
    setLoading(true);
    setTimeout(() => {
      onUpdateSubtitles([
        { id: "s1", startTime: 1.0, endTime: 4.8, text: "O VisionCut Pro impulsiona suas produções ao nível máximo." },
        { id: "s2", startTime: 5.2, endTime: 9.5, text: "Geração em tempo real acelerada por placas de vídeo CUDA." }
      ]);
      setLoading(false);
      alert("🎙️ IA Studio transcreveu com perfeição todas as trilhas vocais detectadas!");
    }, 1000);
  };

  const triggerAIDub = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`🌍 Dublagem IA concluída no idioma [${aiTargetLang}] com voz ultra-realística [${aiDubbingVoice}]!`);
    }, 1200);
  };

  const triggerAICorrect = () => {
    if (!selectedClip) {
      alert("⚠️ Selecione um clipe na timeline primeiro.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      safeUpdateColorGrading({
        temp: 8,
        tint: -2,
        exposure: 15,
        shadows: 10,
        highlights: -5
      });
      setLoading(false);
      alert("🎨 Ajuste Automático Neural: Cores e contraste equalizados com base estética de cinema!");
    }, 800);
  };

  const triggerSmartReframe = () => {
    if (!selectedClip) {
      alert("⚠️ Selecione um clipe na timeline primeiro.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      safeUpdateMotion({ scale: 135, positionX: -20 });
      setLoading(false);
      alert(`🎯 Auto Reframe: Clipe redimensionado e centralizado dinamicamente para o aspecto de ${smartReframeMode}!`);
    }, 950);
  };

  const toggleFavorite = (id: string) => {
    setFavEffects(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="bg-neutral-900 flex flex-col h-full w-full text-neutral-200 select-none font-sans rounded-[6px] overflow-hidden">
      
      {/* 1. COMPACT TAB CONTAINER */}
      <div className="bg-neutral-950 p-1 border-b border-neutral-900 shrink-0">
        <div className="grid grid-cols-6 gap-0.5 bg-neutral-900 p-0.5 rounded-[6px] border border-neutral-850">
          <button
            onClick={() => setActiveTab('transformacao')}
            className={`py-1.5 rounded-[4px] text-[8.5px] font-bold uppercase tracking-wider transition ${
              activeTab === 'transformacao' ? 'bg-neutral-800 text-teal-400 font-extrabold border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title="Ajustes de Posição, Escala e Recorte"
          >
            Ajustes
          </button>
          <button
            onClick={() => setActiveTab('cor')}
            className={`py-1.5 rounded-[4px] text-[8.5px] font-bold uppercase tracking-wider transition ${
              activeTab === 'cor' ? 'bg-neutral-800 text-teal-400 font-extrabold border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title="DaVinci Resolve Style Color Wheels & Curves"
          >
            Grading
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`py-1.5 rounded-[4px] text-[8.5px] font-bold uppercase tracking-wider transition ${
              activeTab === 'audio' ? 'bg-neutral-800 text-teal-400 font-extrabold border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title="Compressão, De-Esser, Limitador e EQ"
          >
            Áudio
          </button>
          <button
            onClick={() => setActiveTab('texto')}
            className={`py-1.5 rounded-[4px] text-[8.5px] font-bold uppercase tracking-wider transition ${
              activeTab === 'texto' ? 'bg-neutral-800 text-teal-400 font-extrabold border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title="Legendas Dinâmicas & Estilo"
          >
            Texto
          </button>
          <button
            onClick={() => setActiveTab('motion')}
            className={`py-1.5 rounded-[4px] text-[8.5px] font-bold uppercase tracking-wider transition ${
              activeTab === 'motion' ? 'bg-neutral-800 text-teal-400 font-extrabold border border-neutral-700' : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title="Animação, Easings e Curvas Bézier"
          >
            Motion
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-1.5 rounded-[4px] text-[8.5px] font-bold uppercase tracking-wider transition ${
              activeTab === 'ai' ? 'bg-neutral-800 text-teal-400 font-extrabold border border-neutral-700' : 'text-neutral-550 hover:text-neutral-300'
            }`}
            title="Sistemas Neurais VisionCut AI"
          >
            AI
          </button>
        </div>
      </div>

      {/* 2. LOADING SPIN OVERLAY */}
      {loading && (
        <div className="m-3 p-2 bg-neutral-950 rounded-[6px] flex items-center justify-center gap-2 border border-teal-500/25 animate-pulse shrink-0">
          <Loader2 className="w-3.5 h-3.5 text-teal-400 animate-spin" />
          <span className="text-[10px] text-white font-extrabold uppercase tracking-widest font-mono">Processando com Aceleração Vulkan...</span>
        </div>
      )}

      {/* 3. ACTIVE SCROLLABLE VIEWPORT */}
      <div className="flex-1 p-3 space-y-3.5 overflow-y-auto min-h-0 text-left">
        
        {/* Selected Clip Indicator */}
        <div className="p-2.5 bg-neutral-950/60 rounded-[6px] border border-neutral-850 flex items-center justify-between gap-2.5">
          <div className="min-w-0">
            <span className="text-[8px] uppercase font-mono text-neutral-500 font-bold block tracking-wider">Alvo em Edição</span>
            <span className="text-[11px] text-white font-black truncate block mt-0.5">
              {selectedClip ? selectedClip.name : "Nenhum clipe ativo"}
            </span>
          </div>
          {selectedClip && (
            <span className="text-[8px] tracking-widest bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-neutral-950 font-black px-1.5 py-0.5 rounded uppercase border border-teal-500/20 font-mono flex-shrink-0">
              {selectedClip.type}
            </span>
          )}
        </div>

        {/* ======================================================== */}
        {/* TAB: TRANSFORMAÇÃO (PROPERTIES) */}
        {/* ======================================================== */}
        {activeTab === 'transformacao' && (
          <div className="space-y-3.5 text-xs">
            
            {/* Position, Scale, Rotation */}
            <div className="space-y-3 p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850">
              <span className="text-[9.5px] font-black text-teal-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Posicionamento
              </span>
              
              {selectedClip && selectedClip.motion ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                        <span>Posição X</span>
                        <span className="text-white font-bold">{selectedClip.motion.positionX}px</span>
                      </div>
                      <input
                        type="range"
                        min="-400"
                        max="400"
                        value={selectedClip.motion.positionX}
                        onChange={(e) => safeUpdateMotion({ positionX: parseInt(e.target.value) })}
                        className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                        <span>Posição Y</span>
                        <span className="text-white font-bold">{selectedClip.motion.positionY}px</span>
                      </div>
                      <input
                        type="range"
                        min="-400"
                        max="400"
                        value={selectedClip.motion.positionY}
                        onChange={(e) => safeUpdateMotion({ positionY: parseInt(e.target.value) })}
                        className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                        <span>Ponto Âncora X</span>
                        <span className="text-white font-bold">{anchorX}px</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={anchorX}
                        onChange={(e) => setAnchorX(parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                        <span>Ponto Âncora Y</span>
                        <span className="text-white font-bold">{anchorY}px</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={anchorY}
                        onChange={(e) => setAnchorY(parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                      <span>Escala (%)</span>
                      <span className="font-bold text-teal-400">{selectedClip.motion.scale}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={selectedClip.motion.scale}
                      onChange={(e) => safeUpdateMotion({ scale: parseInt(e.target.value) })}
                      className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                        <span>Rotação (Graus)</span>
                        <span className="text-white">{selectedClip.motion.rotation || 0}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={selectedClip.motion.rotation || 0}
                        onChange={(e) => safeUpdateMotion({ rotation: parseInt(e.target.value) })}
                        className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                        <span>Opacidade</span>
                        <span className="text-teal-400 font-bold">{selectedClip.motion.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedClip.motion.opacity}
                        onChange={(e) => safeUpdateMotion({ opacity: parseInt(e.target.value) })}
                        className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-neutral-400 tracking-wider font-mono block mb-1">Blend Mode (Mesclar)</label>
                    <select
                      value={blendMode}
                      onChange={(e) => setBlendMode(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-white rounded p-1.5 focus:ring-1 focus:ring-teal-400 focus:outline-none font-mono text-[10px]"
                    >
                      <option value="normal">Normal (Padrão)</option>
                      <option value="multiply">Multiplicar (Multiply)</option>
                      <option value="screen">Tela (Screen)</option>
                      <option value="overlay">Sobrepor (Overlay)</option>
                      <option value="color-dodge">Subexposição de Cor (Color Dodge)</option>
                      <option value="soft-light">Luz Suave (Soft Light)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-neutral-500 italic">Por favor, selecione um clipe visual na Linha do Tempo para carregar os parâmetros.</p>
              )}
            </div>

            {/* Gaussian Blur, Glow & Shadow */}
            <div className="space-y-3 p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850">
              <span className="text-[9.5px] font-black text-teal-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" /> Efeitos Sólidos (Glow & Blur)
              </span>

              {selectedClip && selectedClip.filters ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                      <span>Desfoque Gaussiano (Gaussian Blur)</span>
                      <span className="text-white font-bold">{selectedClip.filters.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={selectedClip.filters.blur}
                      onChange={(e) => safeUpdateFilters({ blur: parseInt(e.target.value) })}
                      className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                      <span>Intensidade de Brilho (Glow)</span>
                      <span className="text-white font-bold">{glowIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={glowIntensity}
                      onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                        <span>Sombra Sólida Opac.</span>
                        <span className="text-white font-mono">{shadowOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={shadowOpacity}
                        onChange={(e) => setShadowOpacity(parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                        <span>Profundidade</span>
                        <span className="text-white font-mono">{shadowDepth}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={shadowDepth}
                        onChange={(e) => setShadowDepth(parseInt(e.target.value))}
                        className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-neutral-500 italic">Nenhum filtro disponível.</p>
              )}
            </div>

            {/* Recorte Panel (Crop) */}
            <div className="space-y-3 p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850">
              <span className="text-[9.5px] font-black text-teal-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono flex items-center gap-1.5 font-bold">
                <Crop className="w-3.5 h-3.5" /> Recorte de Bordas (Padding Crop)
              </span>

              {selectedClip ? (
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[9px] text-neutral-500 font-mono block">Esquerda ({cropLeft}%)</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cropLeft}
                      onChange={(e) => setCropLeft(parseInt(e.target.value))}
                      className="w-full h-0.5 accent-teal-400 bg-neutral-800"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 font-mono block">Direita ({cropRight}%)</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cropRight}
                      onChange={(e) => setCropRight(parseInt(e.target.value))}
                      className="w-full h-0.5 accent-teal-400 bg-neutral-800"
                    />
                  </div>
                  <div className="mt-1">
                    <span className="text-[9px] text-neutral-500 font-mono block">Superior ({cropTop}%)</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cropTop}
                      onChange={(e) => setCropTop(parseInt(e.target.value))}
                      className="w-full h-0.5 accent-teal-400 bg-neutral-800"
                    />
                  </div>
                  <div className="mt-1">
                    <span className="text-[9px] text-neutral-500 font-mono block">Inferior ({cropBottom}%)</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cropBottom}
                      onChange={(e) => setCropBottom(parseInt(e.target.value))}
                      className="w-full h-0.5 accent-teal-400 bg-neutral-800"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-neutral-500 italic">Vazio.</p>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: COR (DAVINCI MODULE & WHEELS) */}
        {/* ======================================================== */}
        {activeTab === 'cor' && (
          <div className="space-y-3.5 text-xs">
            
            {/* Primary Wheels Simulation Panel */}
            <div className="p-3 bg-neutral-950 rounded-[6px] border border-neutral-850 space-y-3">
              <span className="text-[9.5px] font-black text-teal-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono flex items-center justify-between">
                <span>🎛️ Primary Grading Wheels (DaVinci Mode)</span>
                <span className="text-[8px] bg-teal-500/10 border border-teal-500/25 text-teal-400 px-1 py-0.2 rounded">LOG ON</span>
              </span>

              {/* Wheels Toggle buttons - Lift, Gamma, Gain */}
              <div className="flex bg-neutral-900 border border-neutral-800 rounded p-0.5 text-center">
                <button 
                  onClick={() => setActiveWheel('lift')}
                  className={`flex-1 py-1 text-[8.5px] font-bold uppercase rounded ${activeWheel === 'lift' ? 'bg-teal-500 text-neutral-950' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Lift (Sombra)
                </button>
                <button 
                  onClick={() => setActiveWheel('gamma')}
                  className={`flex-1 py-1 text-[8.5px] font-bold uppercase rounded ${activeWheel === 'gamma' ? 'bg-teal-500 text-neutral-950' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Gamma (Médios)
                </button>
                <button 
                  onClick={() => setActiveWheel('gain')}
                  className={`flex-1 py-1 text-[8.5px] font-bold uppercase rounded ${activeWheel === 'gain' ? 'bg-teal-500 text-neutral-950' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Gain (Altos)
                </button>
              </div>

              {/* Dynamic Color Ring XY Pad */}
              <div className="flex flex-col items-center py-2 space-y-2">
                <div className="relative w-28 h-28 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                  {/* Color gradients background */}
                  <div className="absolute inset-1 rounded-full bg-[conic-gradient(from_0deg,_#ff0000,_#ffff00,_#00ff00,_#00ffff,_#0000ff,_#ff00ff,_#ff0000)] opacity-20 pointer-events-none"></div>
                  {/* Slider coordinates dot indicator */}
                  <div 
                    className="absolute w-4 h-4 rounded-full border-2 border-white bg-black/90 shadow-lg cursor-move hover:scale-110 active:scale-95 transition-all"
                    style={{
                      transform: activeWheel === 'lift' 
                        ? `translate(${liftJoy.x}px, ${liftJoy.y}px)` 
                        : activeWheel === 'gamma' 
                          ? `translate(${gammaJoy.x}px, ${gammaJoy.y}px)` 
                          : `translate(${gainJoy.x}px, ${gainJoy.y}px)`
                    }}
                    onMouseDown={(me) => {
                      const rect = me.currentTarget.parentElement?.getBoundingClientRect();
                      if (!rect) return;
                      const handleMouseMove = (fe: MouseEvent) => {
                        const relX = Math.max(-44, Math.min(44, fe.clientX - (rect.left + rect.width / 2)));
                        const relY = Math.max(-44, Math.min(44, fe.clientY - (rect.top + rect.height / 2)));
                        if (activeWheel === 'lift') setLiftJoy({ x: Math.floor(relX), y: Math.floor(relY) });
                        else if (activeWheel === 'gamma') setGammaJoy({ x: Math.floor(relX), y: Math.floor(relY) });
                        else setGainJoy({ x: Math.floor(relX), y: Math.floor(relY) });
                      };
                      const handleMouseUp = () => {
                        window.removeEventListener('mousemove', handleMouseMove);
                        window.removeEventListener('mouseup', handleMouseUp);
                      };
                      window.addEventListener('mousemove', handleMouseMove);
                      window.addEventListener('mouseup', handleMouseUp);
                    }}
                  />
                  <span className="text-[7.5px] text-teal-400 font-mono font-bold select-none pointer-events-none tracking-widest bg-black/80 px-1 rounded uppercase">
                    {activeWheel}
                  </span>
                </div>
                
                <span className="text-[9px] font-mono text-neutral-400">
                  Coordenadas: {
                    activeWheel === 'lift' ? `X: ${liftJoy.x} Y: ${liftJoy.y}` :
                    activeWheel === 'gamma' ? `X: ${gammaJoy.x} Y: ${gammaJoy.y}` : `X: ${gainJoy.x} Y: ${gainJoy.y}`
                  }
                </span>
              </div>
            </div>

            {/* HDR Sliders (Temp, Exposure, shadows, highlights) */}
            <div className="p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850 space-y-3">
              <span className="text-[9.5px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono">
                🎨 HDR Wheel Sliders
              </span>

              {selectedClip && selectedClip.colorGrading ? (
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                      <span>Temperatura</span>
                      <span className={selectedClip.colorGrading.temp > 0 ? "text-amber-400" : "text-blue-450"}>{selectedClip.colorGrading.temp}</span>
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

                  <div>
                    <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                      <span>Tint (Coloração Azul/Magenta)</span>
                      <span>{selectedClip.colorGrading.tint}</span>
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

                  <div>
                    <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                      <span>Exposição (Sinal de Ganho)</span>
                      <span>{selectedClip.colorGrading.exposure}</span>
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

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[8.5px] text-neutral-500 font-mono block">Sombras</span>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={selectedClip.colorGrading.shadows}
                        onChange={(e) => safeUpdateColorGrading({ shadows: parseInt(e.target.value) })}
                        className="w-full h-1 accent-teal-450"
                      />
                    </div>
                    <div>
                      <span className="text-[8.5px] text-neutral-500 font-mono block">Highlights</span>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={selectedClip.colorGrading.highlights}
                        onChange={(e) => safeUpdateColorGrading({ highlights: parseInt(e.target.value) })}
                        className="w-full h-1 accent-teal-450"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-neutral-500 italic">Vazio.</p>
              )}
            </div>

            {/* Interactive RGB Curves simulation */}
            <div className="p-3 bg-neutral-950 rounded-[6px] border border-neutral-850 space-y-2.5">
              <span className="text-[9.5px] font-black text-teal-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono flex items-center justify-between">
                <span>📈 RGB Parade Bezier Curves</span>
                <span className="text-[8px] text-neutral-500 font-mono">Master Luma</span>
              </span>

              {/* Curved SVG Preview representation */}
              <div className="relative w-full h-24 bg-neutral-900 border border-neutral-800 rounded mb-1 flex items-center justify-center">
                <svg className="w-full h-full pointer-events-none">
                  {/* Grid lines */}
                  <line x1="0" y1="32" x2="300" y2="32" stroke="#262626" strokeWidth="1" strokeDasharray="3" />
                  <line x1="0" y1="64" x2="300" y2="64" stroke="#262626" strokeWidth="1" strokeDasharray="3" />
                  <line x1="90" y1="0" x2="90" y2="96" stroke="#262626" strokeWidth="1" strokeDasharray="3" />
                  <line x1="180" y1="0" x2="180" y2="96" stroke="#262626" strokeWidth="1" strokeDasharray="3" />
                  {/* Dynamic Curve path */}
                  <path d="M 10 86 Q 140 40 270 10" fill="none" stroke="#2dd4bf" strokeWidth="2.5" />
                  {/* Keypoint handles */}
                  <circle cx="10" cy="86" r="4.5" fill="#10b981" />
                  <circle cx="140" cy="40" r="5.5" fill="#f43f5e" />
                  <circle cx="270" cy="10" r="4.5" fill="#10b981" />
                </svg>
                <div className="absolute top-2 left-2 text-[8px] font-mono text-neutral-500 uppercase tracking-wider">
                  Highlights Match (Active)
                </div>
              </div>
              <button 
                onClick={() => alert("Curva equalizada para eliminar saturação excessiva em tons de pele.")}
                className="w-full py-1 bg-neutral-900 hover:bg-neutral-800 text-[9px] text-neutral-300 font-mono font-bold rounded uppercase tracking-wider transition"
              >
                Resetar Curva de Tons
              </button>
            </div>

            {/* LUT Manager */}
            <div className="p-3 bg-neutral-950/40 rounded-[6px] border border-neutral-850 space-y-2">
              <span className="text-[9.5px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono">
                🎬 LUT Manager (Color Profiles Library)
              </span>
              
              {selectedClip && selectedClip.colorGrading ? (
                <div className="space-y-1.5">
                  <select
                    value={selectedClip.colorGrading.lutId}
                    onChange={(e) => safeUpdateColorGrading({ lutId: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-teal-400 p-2 rounded-[6px] focus:outline-none font-mono text-[10.5px]"
                  >
                    <option value="none">Nenhum Match LUT (Original)</option>
                    <option value="lut-cinema">Teal & Orange Hollywood LUT</option>
                    <option value="lut-vintage">Vintage Fujifilm Polaroid Preset</option>
                    <option value="lut-cyberpunk">Cyberpunk Saturated Neon Grade</option>
                    <option value="lut-bw">Monochrome High-Contrast Silver Match</option>
                    <option value="lut-warm">Warm Golden Hour Sunset</option>
                    <option value="lut-cold">Cold Nordic Winter Sci-Fi</option>
                  </select>
                  <p className="text-[8.5px] text-neutral-500 font-sans leading-relaxed">
                    Importe LUTs .CUBE personalizados clicando em Arquivo &gt; Importar no menu superior.
                  </p>
                </div>
              ) : (
                <p className="text-[10px] text-neutral-500 italic">Selecione um clipe.</p>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: ÁUDIO (MIXER, LOUDNESS, GATE) */}
        {/* ======================================================== */}
        {activeTab === 'audio' && (
          <div className="space-y-3.5 text-xs">
            
            {/* Audio Settings (Volume and Pan) */}
            <div className="p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850 space-y-3">
              <span className="text-[9.5px] font-black text-teal-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" /> Sônico do Clipe Ativo
              </span>

              {selectedClip && selectedClip.audioSettings ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                      <span>Volume do Clipe ativo</span>
                      <span className="text-white font-bold">{selectedClip.audioSettings.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedClip.audioSettings.volume}
                      onChange={(e) => safeUpdateAudioSettings({ volume: parseInt(e.target.value) })}
                      className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-mono text-[9px] text-neutral-400 mb-0.5">
                      <span>Pan de Balanço Estéreo (E / D)</span>
                      <span className="text-white font-bold">{selectedClip.audioSettings.pan}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={selectedClip.audioSettings.pan}
                      onChange={(e) => safeUpdateAudioSettings({ pan: parseInt(e.target.value) })}
                      className="w-full h-1 bg-neutral-850 accent-teal-400 cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-neutral-500 italic">Nenhum áudio configurado no arquivo ativo.</p>
              )}
            </div>

            {/* EQ Paramétrico */}
            <div className="p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850 space-y-3.5">
              <span className="text-[9.5px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono">
                🎛️ Equalizador Paramétrico (Analog Grade)
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-neutral-900 p-2 rounded border border-neutral-850 text-center space-y-1">
                  <span className="text-[8px] text-neutral-500 font-bold block uppercase">GRAVES</span>
                  <span className="text-[10px] font-black text-emerald-400 font-mono">150Hz</span>
                  <p className="text-[7.5px] text-neutral-400">+12dB</p>
                </div>
                <div className="bg-neutral-900 p-2 rounded border border-neutral-850 text-center space-y-1">
                  <span className="text-[8px] text-neutral-500 font-bold block uppercase">MÉDIOS</span>
                  <span className="text-[10px] font-black text-emerald-400 font-mono">1.2kHz</span>
                  <p className="text-[7.5px] text-neutral-400">-3dB</p>
                </div>
                <div className="bg-neutral-900 p-2 rounded border border-neutral-850 text-center space-y-1">
                  <span className="text-[8px] text-neutral-500 font-bold block uppercase">AGUDOS</span>
                  <span className="text-[10px] font-black text-emerald-400 font-mono">8.0kHz</span>
                  <p className="text-[7.5px] text-neutral-400">+4dB</p>
                </div>
              </div>
            </div>

            {/* Compressor Limiters & Noise gate */}
            <div className="p-3 bg-neutral-950 rounded-[6px] border border-neutral-850 space-y-3">
              <span className="text-[9.5px] font-black text-teal-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono flex items-center justify-between">
                <span>🛡️ Compressor & Limiter Rack</span>
                <span className="text-[8px] text-neutral-500 font-mono uppercase">Master Bus FX</span>
              </span>

              <div className="grid grid-cols-2 gap-2 text-[9.5px] text-neutral-400">
                <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-2 rounded-[4px]">
                  <span>Ativar Compressor</span>
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-teal-400 rounded bg-black border-neutral-800" />
                </div>
                <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-2 rounded-[4px]">
                  <span>Noise Gate Ativo</span>
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-teal-400 rounded bg-black border-neutral-800" />
                </div>
                <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-2 rounded-[4px]">
                  <span>Filtro De-Esser</span>
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-teal-400 rounded bg-black border-neutral-800" />
                </div>
                <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-2 rounded-[4px]">
                  <span>Limiter de Teto</span>
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-teal-400 rounded bg-black border-neutral-800" />
                </div>
              </div>

              {/* LUFS target */}
              <div className="p-1.5 bg-neutral-900 rounded border border-neutral-850 flex items-center justify-between text-[10px]">
                <span className="text-neutral-500 font-mono block uppercase">Loudness Target:</span>
                <span className="font-extrabold text-emerald-400 font-mono">-14.0 LUFS (Broadcast Match)</span>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: TEXTO (LEGENDAGEM & AUTO TRANSLATES) */}
        {/* ======================================================== */}
        {activeTab === 'texto' && (
          <div className="space-y-3.5 text-xs">
            
            {/* Captain Editing Block */}
            <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-[6px] space-y-3">
              <span className="text-[9.5px] font-black text-teal-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono flex items-center justify-between">
                <span>📝 Captions Editor (Legendas de Linha)</span>
                <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 px-1 py-0.2 rounded font-mono">AUTO INJECT</span>
              </span>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Pesquisar legendas geradas..."
                  value={subtitleSearch}
                  onChange={(e) => setSubtitleSearch(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-850 text-white rounded p-1.5 focus:outline-none font-mono text-[10px]"
                />

                {project.subtitles.length > 0 ? (
                  <div className="divide-y divide-neutral-850 max-h-32 overflow-y-auto pr-1">
                    {project.subtitles
                      .filter(sub => sub.text.toLowerCase().includes(subtitleSearch.toLowerCase()))
                      .map((sub, idx) => (
                        <div key={sub.id} className="py-2 text-[10px] space-y-1">
                          <div className="flex justify-between font-mono text-neutral-500 text-[8.5px]">
                            <span>Cap. {idx + 1}</span>
                            <span>{sub.startTime}s - {sub.endTime}s</span>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={sub.text}
                              onChange={(e) => {
                                const shallow = [...project.subtitles];
                                shallow[idx].text = e.target.value;
                                onUpdateSubtitles(shallow);
                              }}
                              className="flex-1 bg-neutral-900/60 border border-neutral-800 text-white text-[10.5px] rounded px-1.5 py-0.5 focus:outline-none"
                            />
                          </div>
                          {sub.translatedText && (
                            <div className="text-[9.5px] text-yellow-300 font-serif italic pl-1">
                              Tradução: {sub.translatedText}
                            </div>
                          )}
                        </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9.5px] text-neutral-500 italic block py-4 text-center">Nenhuma legenda gerada. Vá na aba AI Studio para gerar automaticamente.</p>
                )}
              </div>
            </div>

            {/* Typography & captive box options styling */}
            <div className="p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850 space-y-3">
              <span className="text-[9.5px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono">
                🎨 Typography Captions Engine
              </span>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8.5px] font-mono text-neutral-500 uppercase block mb-0.5">Fonte</label>
                    <select
                      value={textStyleFont}
                      onChange={(e) => setTextStyleFont(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-white p-1 rounded text-[9.5px]"
                    >
                      <option value="Inter">Inter (Sleek UI)</option>
                      <option value="Space Grotesk">Space Grotesk (Tech)</option>
                      <option value="JetBrains Mono">JetBrains Mono (Draft)</option>
                      <option value="Outfit">Outfit Display</option>
                      <option value="Playfair Display">Playfair Display (Class)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[8.5px] font-mono text-neutral-500 uppercase block mb-0.5">Tamanho Fonte</label>
                    <input
                      type="range"
                      min="12"
                      max="72"
                      value={textStyleSize}
                      onChange={(e) => setTextStyleSize(parseInt(e.target.value))}
                      className="w-full h-1 bg-neutral-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8.5px] font-mono text-neutral-500 uppercase block mb-0.5">Cor do Texto</label>
                    <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded p-1">
                      <input
                        type="color"
                        value={textStyleColor}
                        onChange={(e) => setTextStyleColor(e.target.value)}
                        className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded"
                      />
                      <span className="font-mono text-[9px] uppercase">{textStyleColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[8.5px] font-mono text-neutral-500 uppercase block mb-0.5">Cor Caixa Fundo</label>
                    <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded p-1">
                      <input
                        type="color"
                        value={textStyleColor} // Simplified simulation binding
                        onChange={(e) => setTextStyleColor(e.target.value)}
                        className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded"
                      />
                      <span className="font-mono text-[9px] uppercase">Box-Dark</span>
                    </div>
                  </div>
                </div>

                <div className="flex bg-neutral-900/60 p-1 border border-neutral-800 rounded gap-1.5 text-center">
                  <button onClick={() => setTextStyleAlign('left')} className={`flex-1 py-0.5 rounded text-[9px] ${textStyleAlign === 'left' ? 'bg-neutral-800 text-teal-400' : 'text-neutral-500'}`}>ALINHAR ESQ</button>
                  <button onClick={() => setTextStyleAlign('center')} className={`flex-1 py-0.5 rounded text-[9px] ${textStyleAlign === 'center' ? 'bg-neutral-800 text-teal-400' : 'text-neutral-500'}`}>CENTRALIZADO</button>
                  <button onClick={() => setTextStyleAlign('right')} className={`flex-1 py-0.5 rounded text-[9px] ${textStyleAlign === 'right' ? 'bg-neutral-800 text-teal-400' : 'text-neutral-500'}`}>ALINHAR DIR</button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: MOTION (EASING KEYFRAMES, LOWER THIRDS) */}
        {/* ======================================================== */}
        {activeTab === 'motion' && (
          <div className="space-y-3.5 text-xs">
            
            {/* Keyframe control station */}
            <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-[6px] space-y-3">
              <span className="text-[9.5px] font-black text-teal-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono flex items-center justify-between">
                <span>⏱️ Keyframe Easings Timeline</span>
                <span className="text-[8px] bg-teal-500/10 border border-teal-500/25 text-teal-400 px-1 py-0.2 rounded font-mono">ACTIVE POS</span>
              </span>

              <div className="space-y-3 text-[10px]">
                <p className="text-neutral-450 leading-relaxed text-[10px]">
                  Insira pontos de ancoragem temporal na linha do tempo para animar transformações físicas com curvas Bézier.
                </p>

                {/* Simulated Keyframe display timeline */}
                <div className="relative w-full h-8 bg-neutral-900 rounded border border-neutral-800 flex items-center">
                  {/* Grid lines */}
                  <div className="absolute left-[30%] w-px h-full bg-neutral-805/70"></div>
                  <div className="absolute left-[60%] w-px h-full bg-neutral-805/70"></div>
                  {/* Visual dots */}
                  {keyframes.map((kf, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedKeyframe(index)}
                      className={`absolute w-3 h-3 rotate-45 border shadow-xl hover:scale-125 transition ${selectedKeyframe === index ? 'bg-teal-400 border-white' : 'bg-orange-500 border-orange-300'}`}
                      style={{ left: `${kf * 15}%` }}
                      title={`Keyframe no tempo ${kf}s`}
                    />
                  ))}
                  <div className="absolute left-2 text-[8px] text-neutral-500 tracking-wider uppercase font-mono font-bold select-none pointer-events-none">
                    V1 Pista Keyframes
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button 
                    onClick={() => {
                      const shallow = [...keyframes, Math.max(1, Math.min(10, keyframes.length * 2.2))];
                      setKeyframes(shallow);
                    }}
                    className="flex-1 py-1 bg-neutral-900 border border-neutral-800 text-[10px] text-white hover:border-teal-500/30 rounded font-mono transition uppercase font-bold"
                  >
                    + Novo Keyframe (X/Y)
                  </button>
                  <button 
                    onClick={() => {
                      setKeyframes([1.5, 4.2]);
                      setSelectedKeyframe(null);
                    }}
                    className="px-2.5 py-1 bg-red-950/20 text-red-400 border border-red-500/15 hover:bg-neutral-900 rounded font-mono transition uppercase font-semibold text-[9px]"
                  >
                    Limpar
                  </button>
                </div>

                {selectedKeyframe !== null && (
                  <div className="p-2 bg-neutral-900/60 border border-neutral-800 rounded space-y-1 font-mono text-[9px]">
                    <p className="text-white font-bold text-[10px] uppercase">Ajustes do Keyframe #{selectedKeyframe + 1}</p>
                    <p className="text-teal-400">Tempo: {keyframes[selectedKeyframe].toFixed(2)}s</p>
                    <p className="text-neutral-400">Valores: Esquerda / Interpolação Bézier</p>
                    <div className="flex gap-1.5 mt-2">
                      <button onClick={() => alert("Bézier aplicada: suavidade de chegada e saída.")} className="flex-1 py-1 bg-neutral-800 hover:bg-neutral-750 rounded">Smooth Bézier</button>
                      <button onClick={() => alert("Interpolação linear configurada.")} className="flex-1 py-1 bg-neutral-800 hover:bg-neutral-750 rounded">Linear (Direto)</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Title template lower third inserts */}
            <div className="p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850 space-y-2.5">
              <span className="text-[9.5px] font-black text-neutral-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono">
                🎬 Motion Templates (Lower Thirds)
              </span>

              <div className="grid grid-cols-2 gap-2 text-center text-[9.5px]">
                <button 
                  onClick={() => alert("Template inserido na track de texto: Titulo de Introdução Premium")}
                  className="p-2 bg-neutral-900 border border-neutral-800 hover:border-teal-500/40 rounded transition text-left"
                >
                  <span className="text-teal-400 block font-bold mb-0.5">✦ Neon Lower-Third</span>
                  <span className="text-neutral-500 text-[8px] block">Ideal para social tags</span>
                </button>

                <button 
                  onClick={() => alert("Template inserido: Caixa de Notícia Superior")}
                  className="p-2 bg-neutral-900 border border-neutral-800 hover:border-teal-500/40 rounded transition text-left"
                >
                  <span className="text-teal-400 block font-bold mb-0.5">✦ Business Banner</span>
                  <span className="text-neutral-500 text-[8px] block">Título corporativo</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: IA STUDIO (NEURAL RACK CLONED VOICE) */}
        {/* ======================================================== */}
        {activeTab === 'ai' && (
          <div className="space-y-3.5 text-xs">
            
            <div className="p-3 bg-neutral-950 border border-indigo-500/20 rounded-[6px] space-y-2.5">
              <span className="text-[9.5px] font-black text-indigo-400 uppercase tracking-widest block border-b border-neutral-800 pb-1 font-mono flex items-center gap-1.5 animate-pulse">
                <Brain className="w-4 h-4 text-indigo-400" /> IA Neural Core System (Gemini v2.1)
              </span>
              <p className="text-[10px] text-neutral-450 leading-relaxed">
                Acesse o coração inteligente do VisionCut Pro. Transcreva, traduza, duble ou crie cortes automáticos com precisão de IA.
              </p>
            </div>

            {/* Legendas Automáticas & Dublagem */}
            <div className="p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850 space-y-3">
              <span className="text-[9px] uppercase font-mono font-bold text-neutral-400 block">🎙️ Legendas & Cloned Dubbing</span>
              
              <div className="space-y-2">
                <button
                  onClick={triggerAILegend}
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-505 hover:bg-indigo-500 text-white font-extrabold rounded text-[10px] uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Transcrever Áudio por IA
                </button>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <label className="text-[8.5px] font-mono text-neutral-500 block mb-0.5">Idioma Tradução</label>
                    <select
                      value={aiTargetLang}
                      onChange={(e) => setAiTargetLang(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded p-1 text-white text-[9.5px]"
                    >
                      <option value="pt-BR">Português </option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español </option>
                      <option value="ja-JP">日本語 (Japan)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8.5px] font-mono text-neutral-500 block mb-0.5">Voz Clonada</label>
                    <select
                      value={aiDubbingVoice}
                      onChange={(e) => setAiDubbingVoice(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded p-1 text-white text-[9.5px]"
                    >
                      <option value="cinema-male">Narrador Cinema (Masc)</option>
                      <option value="reels-female">Digital Creator (Fem)</option>
                      <option value="podcaster">Studio Podcast Voice</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={triggerAIDub}
                  className="w-full py-1 bg-neutral-900 border border-neutral-800 text-[9.5px] text-indigo-400 font-bold rounded uppercase hover:border-indigo-500/30 tracking-wide transition"
                >
                  DUBAR CLIPE SELECIONADO
                </button>
              </div>
            </div>

            {/* Smart Auto reframer */}
            <div className="p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850 space-y-3">
              <span className="text-[9px] uppercase font-mono font-bold text-neutral-400 block">🎯 Reenquadramento Automático (Auto Reframe)</span>
              
              <div className="space-y-2">
                <select
                  value={smartReframeMode}
                  onChange={(e) => setSmartReframeMode(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 p-1.5 rounded text-[10px]"
                >
                  <option value="9:16 Auto">9:16 Vertical (TikTok/Reels/Shorts)</option>
                  <option value="1:1 Square">1:1 Quadrado (Instagram Post)</option>
                  <option value="16:9 Cinema">16:9 Letterbox Cinematográfico</option>
                </select>

                <button
                  onClick={triggerSmartReframe}
                  className="w-full py-1.5 bg-indigo-950/40 text-indigo-400 border border-indigo-500/25 hover:text-white rounded text-[10px] uppercase font-black tracking-wider transition"
                >
                  Aplicar Smart Auto Reframe
                </button>
              </div>
            </div>

            {/* Noise Enhancer, color, short generator */}
            <div className="p-3 bg-neutral-950/30 rounded-[6px] border border-neutral-850 space-y-2.5">
              <span className="text-[9px] uppercase font-mono font-bold text-neutral-400 block">⚡ Quick Neural Workflows</span>

              <div className="space-y-2.5">
                {/* Voice restore slider */}
                <div>
                  <div className="flex justify-between font-mono text-[8.5px] text-neutral-500 mb-0.5">
                    <span>Melhoramento de Voz Inteligente</span>
                    <span>{voiceEnhanceIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={voiceEnhanceIntensity}
                    onChange={(e) => setVoiceEnhanceIntensity(parseInt(e.target.value))}
                    className="w-full h-1 accent-indigo-455 bg-neutral-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-[9.5px]">
                  <button 
                    onClick={triggerAICorrect}
                    className="p-2 bg-neutral-900 border border-neutral-800 rounded hover:border-indigo-500/30 transition text-left"
                  >
                    <span className="text-teal-400 block font-bold mb-0.5">✦ Auto Cor de Cor</span>
                    <span className="text-neutral-500 text-[8px] block">Ajuste neural de luma</span>
                  </button>

                  <button 
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        setLoading(false);
                        alert("🎬 Shorts e TikToks virais: Seu vídeo mais longo foi analisado e recortado em 3 novos clipes curtos com alto fator de retenção!");
                      }, 1300);
                    }}
                    className="p-2 bg-neutral-900 border border-neutral-800 rounded hover:border-indigo-500/30 transition text-left"
                  >
                    <span className="text-teal-400 block font-bold mb-0.5">✦ Criador de Shorts</span>
                    <span className="text-neutral-500 text-[8px] block">Corta clipes virais 9:16</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
