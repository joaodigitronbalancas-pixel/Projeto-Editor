import React, { useState, useEffect } from "react";
import { 
  Project, 
  Clip, 
  Asset, 
  VideoFilters, 
  ColorGrading, 
  MotionParams,
  AudioSettings
} from "../types";
import { 
  MOCK_ASSETS, 
  MOCK_LUTS, 
  MOCK_EFFECTS, 
  MOCK_TRANSITIONS, 
  MOCK_TEMPLATES 
} from "../data/mockAssets";
import { 
  Folder, 
  Film, 
  Image, 
  Music, 
  Radio, 
  Layers, 
  Star, 
  Trash2, 
  Search, 
  Plus, 
  Sliders, 
  Type, 
  Flame, 
  Compass,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Settings,
  X
} from "lucide-react";

interface SidebarProps {
  project: Project;
  selectedClipId: string | null;
  onAddAssetToTimeline: (asset: Asset) => void;
  onUpdateFilters: (clipId: string, filters: Partial<VideoFilters>) => void;
  onUpdateColorGrading: (clipId: string, grading: Partial<ColorGrading>) => void;
  onUpdateMotion: (clipId: string, motion: Partial<MotionParams>) => void;
  onUpdateAudioSettings: (clipId: string, audio: Partial<AudioSettings>) => void;
  onUpdateClipText: (clipId: string, text: string) => void;
  onApplyPresetTemplate: (templateId: string) => void;
  onDeleteClip: (clipId: string) => void;
  activeTabOverride?: 'media' | 'effects' | 'text' | 'marketplace' | 'templates';
}

export default function Sidebar({
  project,
  selectedClipId,
  onAddAssetToTimeline,
  onUpdateFilters,
  onUpdateColorGrading,
  onUpdateMotion,
  onUpdateAudioSettings,
  onUpdateClipText,
  onApplyPresetTemplate,
  onDeleteClip,
  activeTabOverride
}: SidebarProps) {
  // Navigation categories representing the 1st Column (55px width)
  const [activeTab, setActiveTab] = useState<'media' | 'effects' | 'controls' | 'text' | 'transitions' | 'audio'>('media');

  useEffect(() => {
    if (activeTabOverride) {
      if (activeTabOverride === 'media') setActiveTab('media');
      else if (activeTabOverride === 'effects') setActiveTab('effects');
      else if (activeTabOverride === 'text') setActiveTab('text');
    }
  }, [activeTabOverride]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<'all' | 'video' | 'image' | 'audio' | 'text' | 'favorites' | 'trash'>('all');
  
  // Local state files pool
  const [importedAssets, setImportedAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [customFileName, setCustomFileName] = useState("");
  const [customFileType, setCustomFileType] = useState<'video' | 'audio' | 'image'>('video');

  // Find clip
  const selectedClip = project.clips.find(c => c.id === selectedClipId);

  // Filter assets based on search query and folder filter
  const filteredAssets = importedAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFolder === 'all') return matchesSearch;
    if (selectedFolder === 'video') return matchesSearch && asset.type === 'video';
    if (selectedFolder === 'image') return matchesSearch && asset.type === 'image';
    if (selectedFolder === 'audio') return matchesSearch && asset.type === 'audio';
    if (selectedFolder === 'text') return matchesSearch && asset.type === 'text';
    if (selectedFolder === 'favorites') return matchesSearch && (asset.id.includes("1") || asset.id.includes("3")); // mock favorites
    if (selectedFolder === 'trash') return false; // simulated empty trash
    return matchesSearch;
  });

  const handleImportLocalAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFileName.trim()) return;

    const newAsset: Asset = {
      id: `custom-asset-${Date.now()}`,
      name: customFileName,
      type: customFileType,
      url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=300",
      duration: customFileType === 'audio' ? 45 : 12,
      size: `${Math.floor(Math.random() * 45 + 10)} MB`,
      resolution: customFileType === 'audio' ? "48 kHz" : "1920x1080"
    };

    setImportedAssets([...importedAssets, newAsset]);
    setCustomFileName("");
    alert(`📥 Mídia "${newAsset.name}" adicionada ao Pool de Projetos.`);
  };

  return (
    <div className="flex h-full bg-neutral-950 text-neutral-200 select-none overflow-hidden">
      
      {/* COLUMN 1: Fixed 55px vertical icon sidebar */}
      <div className="w-[55px] bg-neutral-950 border-r border-neutral-900 flex flex-col items-center py-3 gap-1 shrink-0 z-10 justify-between h-full">
        <div className="flex flex-col items-center gap-1.5 w-full">
          {/* Mídia */}
          <button
            onClick={() => setActiveTab('media')}
            className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all ${
              activeTab === 'media' 
                ? 'bg-neutral-900 text-teal-400 border border-neutral-800' 
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40'
            }`}
            title="Mídia (Arquivos de Projeto)"
          >
            <Film className="w-5 h-5" />
            <span className="text-[7.5px] mt-0.5 tracking-tighter">Mídia</span>
          </button>

          {/* Efeitos */}
          <button
            onClick={() => setActiveTab('effects')}
            className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all ${
              activeTab === 'effects' 
                ? 'bg-neutral-900 text-teal-400 border border-neutral-800' 
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40'
            }`}
            title="Efeitos de Vídeo"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[7.5px] mt-0.5 tracking-tighter">Efeitos</span>
          </button>

          {/* Controles */}
          <button
            onClick={() => setActiveTab('controls')}
            className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all ${
              activeTab === 'controls' 
                ? 'bg-neutral-900 text-teal-400 border border-neutral-800' 
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40'
            }`}
            title="Controles de Clipe"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-[7.5px] mt-0.5 tracking-tighter">Filtros</span>
          </button>

          {/* Texto */}
          <button
            onClick={() => setActiveTab('text')}
            className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all ${
              activeTab === 'text' 
                ? 'bg-neutral-900 text-teal-400 border border-neutral-800' 
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40'
            }`}
            title="Títulos de Texto / Legendas"
          >
            <Type className="w-5 h-5" />
            <span className="text-[7.5px] mt-0.5 tracking-tighter">Texto</span>
          </button>

          {/* Transições */}
          <button
            onClick={() => setActiveTab('transitions')}
            className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all ${
              activeTab === 'transitions' 
                ? 'bg-neutral-900 text-teal-400 border border-neutral-800' 
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40'
            }`}
            title="Transições Cinematográficas"
          >
            <Flame className="w-5 h-5" />
            <span className="text-[7.5px] mt-0.5 tracking-tighter">Transição</span>
          </button>

          {/* Áudio */}
          <button
            onClick={() => setActiveTab('audio')}
            className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all ${
              activeTab === 'audio' 
                ? 'bg-neutral-900 text-teal-400 border border-neutral-800' 
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40'
            }`}
            title="Áudio FX & Plugins"
          >
            <Music className="w-5 h-5" />
            <span className="text-[7.5px] mt-0.5 tracking-tighter">Áudio</span>
          </button>
        </div>

        <div className="flex flex-col items-center w-full pb-2">
          <div className="w-6 h-6 rounded-full bg-neutral-900 text-[10px] flex items-center justify-center border border-neutral-850 font-bold text-neutral-400" title="Pro Mode v2">
            P
          </div>
        </div>
      </div>

      {/* COLUMN 2: 260px wide Content Panel */}
      <div className="w-[260px] bg-neutral-950 flex flex-col h-full overflow-hidden shrink-0">
        
        {/* Header Title based on Active Tab */}
        <div className="p-3 border-b border-neutral-900 bg-neutral-950 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-300">
            {activeTab === 'media' && "Biblioteca de Mídia"}
            {activeTab === 'effects' && "Galeria de Efeitos"}
            {activeTab === 'controls' && "Controle de Efeitos"}
            {activeTab === 'text' && "Inclusão de Texto"}
            {activeTab === 'transitions' && "Transições Criativas"}
            {activeTab === 'audio' && "Plugins de Som"}
          </span>
          <span className="text-[9px] font-mono text-neutral-500">v2.0</span>
        </div>

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto min-h-0">
          
          {/* TAB: MEDIA */}
          {activeTab === 'media' && (
            <div className="p-3 space-y-3.5 text-left">
              
              {/* Folders List selection box */}
              <div className="space-y-1">
                <span className="text-[8.5px] text-neutral-500 font-mono font-bold uppercase tracking-wider block">Pastas do Projeto</span>
                <div className="space-y-0.5 bg-neutral-900/30 p-1.5 rounded-lg border border-neutral-850">
                  <button 
                    onClick={() => setSelectedFolder('all')}
                    className={`w-full text-left py-1 px-2 text-[10.5px] rounded flex items-center justify-between transition-colors ${
                      selectedFolder === 'all' ? 'bg-neutral-800 text-teal-400 font-bold' : 'text-neutral-400 hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><Folder className="w-3.5 h-3.5" /> Pool Principal</span>
                    <span className="text-[9px] text-neutral-500 font-mono">{importedAssets.length}</span>
                  </button>

                  <button 
                    onClick={() => setSelectedFolder('video')}
                    className={`w-full text-left py-1 px-2 text-[10.5px] rounded flex items-center justify-between transition-colors ${
                      selectedFolder === 'video' ? 'bg-neutral-800 text-teal-400 font-bold' : 'text-neutral-400 hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><Film className="w-3.5 h-3.5" /> Vídeos</span>
                    <span className="text-[9px] text-neutral-500 font-mono">{importedAssets.filter(a => a.type === 'video').length}</span>
                  </button>

                  <button 
                    onClick={() => setSelectedFolder('image')}
                    className={`w-full text-left py-1 px-2 text-[10.5px] rounded flex items-center justify-between transition-colors ${
                      selectedFolder === 'image' ? 'bg-neutral-800 text-teal-400 font-bold' : 'text-neutral-400 hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><Image className="w-3.5 h-3.5" /> Imagens</span>
                    <span className="text-[9px] text-neutral-500 font-mono">{importedAssets.filter(a => a.type === 'image').length}</span>
                  </button>

                  <button 
                    onClick={() => setSelectedFolder('audio')}
                    className={`w-full text-left py-1 px-2 text-[10.5px] rounded flex items-center justify-between transition-colors ${
                      selectedFolder === 'audio' ? 'bg-neutral-800 text-teal-400 font-bold' : 'text-neutral-400 hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><Music className="w-3.5 h-3.5" /> Áudios</span>
                    <span className="text-[9px] text-neutral-500 font-mono">{importedAssets.filter(a => a.type === 'audio').length}</span>
                  </button>

                  <button 
                    onClick={() => setSelectedFolder('favorites')}
                    className={`w-full text-left py-1 px-2 text-[10.5px] rounded flex items-center justify-between transition-colors ${
                      selectedFolder === 'favorites' ? 'bg-neutral-800 text-teal-400 font-bold' : 'text-neutral-400 hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Favoritos</span>
                    <span className="text-[9px] text-neutral-500 font-mono">2</span>
                  </button>

                  <button 
                    onClick={() => setSelectedFolder('trash')}
                    className={`w-full text-left py-1 px-2 text-[10.5px] rounded flex items-center justify-between transition-colors ${
                      selectedFolder === 'trash' ? 'bg-neutral-800 text-teal-400 font-bold' : 'text-neutral-400 hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Lixeira</span>
                    <span className="text-[9px] text-neutral-500 font-mono">0</span>
                  </button>
                </div>
              </div>

              {/* Import trigger / Register Local File Form */}
              <form onSubmit={handleImportLocalAsset} className="p-2.5 bg-neutral-900/50 border border-neutral-850 rounded-lg space-y-1.5 text-[10px]">
                <span className="font-bold text-teal-400 block uppercase tracking-wider select-none text-[8.5px]">Importar Mídia</span>
                <div className="flex gap-1">
                  <input
                    type="text"
                    required
                    placeholder="Nome: ex: Video_Cyber.mp4"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    className="flex-1 bg-neutral-950 text-white rounded p-1 text-[10px] focus:outline-none placeholder-neutral-600"
                  />
                  <select 
                    value={customFileType} 
                    onChange={(e) => setCustomFileType(e.target.value as any)}
                    className="bg-neutral-950 text-white rounded p-1 focus:outline-none text-[10px]"
                  >
                    <option value="video">Vídeo</option>
                    <option value="audio">Áudio</option>
                    <option value="image">Img</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full py-1 bg-neutral-800 hover:bg-teal-500 text-teal-400 hover:text-neutral-950 transition font-mono font-bold uppercase rounded text-[8.5px]"
                >
                  Confirmar Inclusão
                </button>
              </form>

              {/* SEARCH INPUT BAR */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Pesquisar neste painel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-[10.5px] bg-neutral-900 border border-neutral-850 rounded p-1.5 pl-8 text-white focus:outline-none focus:border-teal-400 placeholder-neutral-550"
                />
              </div>

              {/* Grid of clip thumbnails */}
              <div className="space-y-1.5">
                <span className="text-[8.5px] text-neutral-500 font-mono font-bold uppercase tracking-wider block">Lista de Clipes</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <div 
                        key={asset.id} 
                        className="p-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 rounded-lg flex flex-col justify-between h-24 text-left transition group relative overflow-hidden"
                      >
                        <div className="h-10 bg-black/60 rounded flex items-center justify-center text-lg relative overflow-hidden shrink-0">
                          {asset.type === 'video' ? "📹" : asset.type === 'audio' ? "🎵" : "🖼️"}
                          <span className="absolute bottom-0.5 right-0.5 text-[7px] bg-black/80 px-1 py-0.2 rounded text-white font-mono">{asset.duration}s</span>
                        </div>
                        
                        <div className="mt-1 flex-1 min-w-0">
                          <p className="font-bold text-[9px] text-neutral-200 truncate select-none" title={asset.name}>{asset.name}</p>
                          <p className="text-[7.5px] text-neutral-500 font-mono">{asset.resolution || "1080p"}</p>
                        </div>

                        <button
                          onClick={() => onAddAssetToTimeline(asset)}
                          className="absolute inset-0 bg-teal-500/90 text-neutral-950 opacity-0 group-hover:opacity-100 transition flex items-center justify-center font-bold text-[10px] gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Timeline</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-4 text-neutral-500 text-[9px]">
                      Nenhuma mídia encontrada
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB: EFFECTS */}
          {activeTab === 'effects' && (
            <div className="p-3 space-y-4 text-left">
              <span className="text-[9px] text-neutral-500 font-mono font-bold uppercase block">Filtros & LUTs Presets</span>
              <div className="grid grid-cols-2 gap-1.5">
                {MOCK_EFFECTS.map(effect => (
                  <button
                    key={effect.id}
                    onClick={() => {
                      if (selectedClipId) {
                        onUpdateFilters(selectedClipId, { blur: 5, brightness: 120 });
                        alert(`✨ Filtro "${effect.name}" aplicado ao clipe ativo!`);
                      } else {
                        alert("⚠️ Selecione um clipe na Linha do Tempo primeiro para aplicar este efeito.");
                      }
                    }}
                    className="p-2 bg-neutral-900 hover:bg-neutral-850 hover:border-teal-400 rounded-lg border border-neutral-850 transition text-left flex flex-col justify-between h-18 cursor-pointer text-[10px]"
                  >
                    <span className="text-[7px] text-teal-400 font-mono uppercase bg-teal-500/10 px-1 rounded-sm w-fit">{effect.category}</span>
                    <span className="font-semibold text-white mt-1 truncate w-full">{effect.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CONTROLES */}
          {activeTab === 'controls' && (
            <div className="p-3 text-left space-y-4">
              <span className="text-[9px] text-neutral-500 font-mono font-bold uppercase block">Controles do Clipe Selecionado</span>
              
              {selectedClip ? (
                <div className="space-y-4 text-xs">
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <p className="text-[10px] text-neutral-500 uppercase font-mono">Selecionado:</p>
                    <p className="font-bold text-white truncate">{selectedClip.name}</p>
                    <p className="text-[9px] text-teal-400 mt-1 font-mono uppercase bg-neutral-950/80 px-1 rounded-sm w-fit">{selectedClip.type}</p>
                  </div>

                  {/* Volume fast tuner */}
                  {selectedClip.type === 'audio' || selectedClip.type === 'video' ? (
                    <div className="space-y-1 bg-neutral-900/20 p-2 border border-neutral-855 rounded-lg">
                      <span className="text-[10px] text-neutral-400 font-semibold block mb-1">Volume do Clipe</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedClip.volume ?? 80}
                        onChange={(e) => onUpdateAudioSettings(selectedClip.id, { volume: parseInt(e.target.value) })}
                        className="w-full h-1 accent-teal-400 cursor-pointer"
                      />
                      <span className="text-[9px] font-mono text-teal-400">{selectedClip.volume ?? 80}%</span>
                    </div>
                  ) : null}

                  {selectedClip.filters && (
                    <div className="space-y-3 bg-neutral-900/40 p-2 border border-neutral-850 rounded-lg">
                      <span className="text-[10px] text-neutral-300 font-bold block uppercase border-b border-neutral-800 pb-1">Filtros de Vídeo</span>
                      
                      <div>
                        <span className="text-[9px] text-neutral-450 block mb-0.5">Brightness ({selectedClip.filters.brightness}%)</span>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={selectedClip.filters.brightness}
                          onChange={(e) => onUpdateFilters(selectedClip.id, { brightness: parseInt(e.target.value) })}
                          className="w-full h-1 accent-teal-400"
                        />
                      </div>

                      <div>
                        <span className="text-[9px] text-neutral-450 block mb-0.5">Contrast ({selectedClip.filters.contrast}%)</span>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={selectedClip.filters.contrast}
                          onChange={(e) => onUpdateFilters(selectedClip.id, { contrast: parseInt(e.target.value) })}
                          className="w-full h-1 accent-teal-400"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => onDeleteClip(selectedClip.id)}
                    className="w-full py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 text-red-400 font-bold uppercase rounded text-[10px]"
                  >
                    Excluir clipe
                  </button>
                </div>
              ) : (
                <div className="py-6 text-center text-neutral-500 text-[10px] font-medium leading-relaxed">
                  Clique em um clipe para carregar controles rápidos.
                </div>
              )}
            </div>
          )}

          {/* TAB: TEXT */}
          {activeTab === 'text' && (
            <div className="p-3 text-left space-y-4">
              <span className="text-[9px] text-neutral-500 font-mono font-bold uppercase block">Adicionar Texto / Sub</span>
              
              {selectedClip && selectedClip.type === 'text' ? (
                <div className="space-y-3">
                  <span className="text-[10px] text-teal-400 block font-bold">Gerenciador de Legenda</span>
                  <textarea
                    rows={3}
                    value={selectedClip.textContent || ""}
                    onChange={(e) => onUpdateClipText(selectedClip.id, e.target.value)}
                    placeholder="Conteúdo do texto..."
                    className="w-full p-1.5 bg-neutral-900 border border-neutral-800 rounded font-sans text-xs focus:outline-none text-white focus:border-teal-400"
                  />
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button 
                      onClick={() => onUpdateClipText(selectedClip.id, "🔥 INSCREVA-SE! 👍")}
                      className="p-1 px-2 bg-neutral-900 text-[9px] text-neutral-300 rounded border border-neutral-850"
                    >
                      Preset Like
                    </button>
                    <button 
                      onClick={() => onUpdateClipText(selectedClip.id, "💎 VISIONCUT PRO v2 💎")}
                      className="p-1 px-2 bg-neutral-900 text-[9px] text-neutral-300 rounded border border-neutral-850"
                    >
                      Preset Intro
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] text-neutral-400 leading-normal">Selecione uma faixa de texto ou insira um novo clipe de letreiro animativo:</p>
                  <button
                    onClick={() => {
                      onUpdateClipText("add-new-text-lower", "Lower-Third Social");
                      alert("📝 Lower-Third adicionada na agulha atual!");
                    }}
                    className="w-full py-1.5 bg-neutral-900 hover:border-teal-500 hover:bg-neutral-850 transition text-[10px] text-neutral-300 border border-neutral-800 rounded uppercase font-bold"
                  >
                    + Criar Lower-Third
                  </button>
                  <button
                    onClick={() => {
                      onUpdateClipText("add-new-text-cyber", "Cyber Neon Large");
                      alert("📝 Título Neon Cyber adicionado!");
                    }}
                    className="w-full py-1.5 bg-neutral-900 hover:border-teal-500 hover:bg-neutral-850 transition text-[10px] text-neutral-300 border border-neutral-800 rounded uppercase font-bold"
                  >
                    + Criar Título Cyber
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: TRANSITIONS */}
          {activeTab === 'transitions' && (
            <div className="p-3 space-y-4 text-left">
              <span className="text-[9px] text-neutral-500 font-mono font-bold uppercase block">Formatos e Cortadores</span>
              <div className="space-y-1.5">
                {MOCK_TRANSITIONS.map(trans => (
                  <div key={trans.id} className="p-2 bg-neutral-900 border border-neutral-850 rounded flex justify-between items-center text-[10.5px]">
                    <div>
                      <p className="font-bold text-white leading-none">{trans.name}</p>
                      <p className="text-[8px] text-neutral-500 font-mono mt-1">{trans.duration}s de suavização</p>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedClipId) {
                          alert(`🔥 Transição "${trans.name}" adicionada no início do clipe.`);
                        } else {
                          alert("⚠️ Selecione um clipe na timeline para vincular a transição.");
                        }
                      }}
                      className="p-1 px-2 border border-teal-500/20 text-teal-400 text-[8.5px] font-bold rounded-sm hover:bg-teal-500 hover:text-neutral-950 uppercase"
                    >
                      Inserir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AUDIO */}
          {activeTab === 'audio' && (
            <div className="p-3 space-y-4 text-left">
              <span className="text-[9px] text-neutral-500 font-mono font-bold uppercase block">Plugins & Foley Estúdio</span>
              <div className="p-2 bg-gradient-to-tr from-neutral-900 to-indigo-950/15 border border-indigo-500/10 rounded-lg text-[10px] space-y-1">
                <span className="font-bold text-indigo-400 uppercase block font-mono text-[8.5px] tracking-wider">Sound Effects Rack</span>
                <p className="text-neutral-400 text-[9px]">Gatilhos de correção sônica e plugins VST3 emulados pelo master:</p>
                <div className="pt-2 text-[9px] space-y-1 text-neutral-300">
                  <p>✔ iZotope Ozone Dynamic</p>
                  <p>✔ FabFilter Pro-Q Sincronizado</p>
                  <p>✔ Compressor Brickwall Limiter</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
