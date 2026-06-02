import React, { useState, useEffect, useRef } from "react";
import { Project, Clip, Subtitle, Asset, VideoFilters, ColorGrading, MotionParams } from "../types";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Tv, 
  Maximize, 
  Download, 
  Grid, 
  Layers, 
  Maximize2,
  ListRestart,
  Sliders,
  Sparkles,
  Camera,
  Cpu,
  MonitorCheck,
  Flame,
  Palette,
  Percent,
  CircleDot,
  Dribbble,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  Plus,
  RefreshCw,
  FolderOpen,
  X
} from "lucide-react";

interface MonitorProps {
  project: Project;
  currentTime: number;
  onSetCurrentTime: (time: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onExport: (format: string, resolution: string, isGpu: boolean) => void;
  selectedClip: Clip | null;
  activeSubtitle: Subtitle | null;
  onUpdateFilters?: (clipId: string, filters: Partial<VideoFilters>) => void;
  onUpdateColorGrading?: (clipId: string, grading: Partial<ColorGrading>) => void;
  onUpdateMotion?: (clipId: string, motion: Partial<MotionParams>) => void;
  onAddAssetToTimeline?: (asset: Asset) => void;
  sourceAsset?: Asset | null;
  onSelectSourceAsset?: (asset: Asset | null) => void;
  activeTabOverride?: 'program' | 'source' | 'grading' | 'scopes';
  forcedDualMonitor?: boolean;
  onToggleCinemaMode?: (active: boolean) => void;
}

export default function Monitor({
  project,
  currentTime,
  onSetCurrentTime,
  isPlaying,
  onTogglePlay,
  onExport,
  selectedClip,
  activeSubtitle,
  onUpdateFilters,
  onUpdateColorGrading,
  onUpdateMotion,
  onAddAssetToTimeline,
  sourceAsset = null,
  onSelectSourceAsset,
  activeTabOverride,
  forcedDualMonitor = false,
  onToggleCinemaMode
}: MonitorProps) {
  // Navigation Tabs at the Monitor area
  const [activeTab, setActiveTab] = useState<'program' | 'source' | 'grading' | 'scopes'>('program');
  const [showGrid, setShowGrid] = useState(false);
  const [safeArea, setSafeArea] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [scalingMode, setScalingMode] = useState<'fit' | 'fill'>('fit');

  // Video Engineering Overlays
  const [zebraExposure, setZebraExposure] = useState<boolean>(false);
  const [focusPeaking, setFocusPeaking] = useState<boolean>(false);
  const [pixelGrid, setPixelGrid] = useState<boolean>(false);
  const [hdrPreview, setHdrPreview] = useState<boolean>(false);
  
  // Custom workspace and premium options
  const [dualMonitor, setDualMonitor] = useState<boolean>(forcedDualMonitor);
  const [zoomPercent, setZoomPercent] = useState<'fit' | '50%' | '100%' | '150%' | '200%'>('fit');
  const [isCinema, setIsCinema] = useState<boolean>(false);

  // Sync with App layout triggers
  useEffect(() => {
    if (activeTabOverride) {
      setActiveTab(activeTabOverride);
    }
  }, [activeTabOverride]);

  useEffect(() => {
    setDualMonitor(forcedDualMonitor);
  }, [forcedDualMonitor]);

  useEffect(() => {
    if (onToggleCinemaMode) {
      onToggleCinemaMode(isCinema);
    }
  }, [isCinema, onToggleCinemaMode]);
  
  // Source Monitor specific controls
  const [sourceTime, setSourceTime] = useState(0);
  const [sourceIsPlaying, setSourceIsPlaying] = useState(false);
  const [sourceInPoint, setSourceInPoint] = useState<number | null>(null);
  const [sourceOutPoint, setSourceOutPoint] = useState<number | null>(null);
  const [sourcePreviewAsset, setSourcePreviewAsset] = useState<Asset | null>(project.sequences[0] ? {
    id: "sample-drone",
    name: "Mountain Drone Flight (Source Raw).mp4",
    type: "video",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    duration: 52,
    size: "240 MB",
    resolution: "3840x2160 (4K)"
  } : null);

  // Resolution proxy quality simulation
  const [playbackQuality, setPlaybackQuality] = useState<"full" | "1/2" | "1/4" | "1/8">("1/2");

  // Export Settings Form
  const [exportPlatform, setExportPlatform] = useState("youtube");
  const [exportRes, setExportRes] = useState("1080p");
  const [exportCodec, setExportCodec] = useState("h264"); // h264, h265, prores, dnxhd, av1
  const [gpuAccelerated, setGpuAccelerated] = useState(true);
  const [hardwareApi, setHardwareApi] = useState("cuda"); // cuda, opencl, directx, vulkan
  const [exportProgress, setExportProgress] = useState(0);
  const [smartBrollSearch, setSmartBrollSearch] = useState("");

  // Scopes rendering references
  const scopesCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // DaVinci Color wheels coordinates
  const [liftJoy, setLiftJoy] = useState({ x: -10, y: 15 });
  const [gammaJoy, setGammaJoy] = useState({ x: 5, y: -8 });
  const [gainJoy, setGainJoy] = useState({ x: 12, y: 8 });

  // DaVinci Curves coordinates
  const [curvePoints, setCurvePoints] = useState([
    { id: 'black', x: 0, y: 180, label: 'Shadows', active: false },
    { id: 'mid', x: 90, y: 90, label: 'Midtones', active: false },
    { id: 'white', x: 180, y: 0, label: 'Highlights', active: false }
  ]);
  const [activePointId, setActivePointId] = useState<string | null>(null);

  // Active color channel for Grading RGB mixer
  const [rgbMixerRed, setRgbMixerRed] = useState(100);
  const [rgbMixerGreen, setRgbMixerGreen] = useState(100);
  const [rgbMixerBlue, setRgbMixerBlue] = useState(100);

  // Time Formatter (HH:MM:SS:FF)
  const formatTime = (timeInSecs: number) => {
    const hours = Math.floor(timeInSecs / 3600);
    const mins = Math.floor((timeInSecs % 3600) / 60);
    const secs = Math.floor(timeInSecs % 60);
    const frames = Math.floor((timeInSecs % 1) * 30); // 30fps simulation

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  };

  // Find the clip currently being scrubbed in track v1 or track v2 (visual clips)
  const activeVisualClip = project.clips.find(clip => {
    return (clip.type === 'video' || clip.type === 'image') &&
      currentTime >= clip.start &&
      currentTime <= (clip.start + clip.duration);
  });

  // Calculate CSS filters based on active visual clip settings
  const getFilterStyle = (clip: Clip) => {
    if (!clip.filters) return {};
    const f = clip.filters;
    const brightnessVal = hdrPreview ? f.brightness * 1.35 : f.brightness;
    const contrastVal = hdrPreview ? f.contrast * 1.25 : f.contrast;
    const saturateVal = hdrPreview ? f.saturate * 1.45 : f.saturate;
    return {
      filter: `brightness(${brightnessVal}%) contrast(${contrastVal}%) saturate(${saturateVal}%) blur(${f.blur}px) hue-rotate(${f.hueRotate}deg) grayscale(${f.grayscale}%) sepia(${f.sepia}%) invert(${f.invert}%)`,
    };
  };

  // Calculate Motion styling (Scale, X, Y, opacity, rotation)
  const getMotionStyle = (clip: Clip) => {
    if (!clip.motion) return {};
    const m = clip.motion;
    return {
      transform: `translate(${m.positionX}px, ${m.positionY}px) scale(${m.scale / 100}) rotate(${m.rotation}deg)`,
      opacity: m.opacity / 100,
      transition: isPlaying ? 'none' : 'transform 0.1s ease-out'
    };
  };

  // Color Grading LUT style modifier definitions
  const getLutClass = (clip: Clip) => {
    if (!clip.colorGrading) return "";
    const lutId = clip.colorGrading.lutId;
    if (lutId === "lut-cinema") return "sepia-[0.15] hue-rotate-[5deg] saturate-[1.25] brightness-[1.05]";
    if (lutId === "lut-vintage") return "sepia-[0.4] saturate-[0.85] contrast-[0.95]";
    if (lutId === "lut-cyberpunk") return "hue-rotate-[180deg] saturate-[1.8] brightness-[0.95]";
    if (lutId === "lut-bw") return "grayscale-100 contrast-[1.4]";
    if (lutId === "lut-warm") return "contrast-[1.05] sepia-[0.1] saturate-[1.12]";
    if (lutId === "lut-cold") return "hue-rotate-[-10deg] saturate-[0.9] brightness-[0.95]";
    return "";
  };

  const getZoomStyle = () => {
    if (zoomPercent === 'fit') return {};
    const scale = parseFloat(zoomPercent) / 100;
    return {
      transform: `scale(${scale})`,
      transition: 'transform 0.15s ease-out'
    };
  };

  // Source Monitor clock timer loop
  useEffect(() => {
    let timer: any;
    if (sourceIsPlaying) {
      timer = setInterval(() => {
        setSourceTime(t => {
          const limit = sourcePreviewAsset ? sourcePreviewAsset.duration : 60;
          if (t >= limit) {
            setSourceIsPlaying(false);
            return 0;
          }
          return t + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [sourceIsPlaying, sourcePreviewAsset]);

  // Handle outside loaded sourceAsset from App
  useEffect(() => {
    if (sourceAsset) {
      setSourcePreviewAsset(sourceAsset);
      setSourceTime(0);
      setActiveTab('source');
      if (onSelectSourceAsset) onSelectSourceAsset(null); // Reset trigger
    }
  }, [sourceAsset]);

  // Draw Scopes (Histogram / Waveform / Vectorscope) inside canvas
  useEffect(() => {
    const canvas = scopesCanvasRef.current;
    if (!canvas || activeTab !== 'scopes') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    
    // Simulate scope pixels matching warmth and playhead
    const render = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 1;
      
      // Draw grid lines
      ctx.strokeStyle = "#1a1a1a";
      for (let i = 25; i < canvas.height; i += 25) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      const pointsCount = 180;
      const waveOffset = Math.sin(currentTime * 2) * 15;
      const warmthFactor = selectedClip?.colorGrading?.temp ? selectedClip.colorGrading.temp / 3 : 0;
      const exposureFactor = selectedClip?.colorGrading?.exposure ? selectedClip.colorGrading.exposure / 1.5 : 0;

      // Draw Waveform scope (Green/Teal traces)
      ctx.strokeStyle = "rgba(45, 212, 191, 0.45)"; // Teal glowing line
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 1.5) {
        // Calculate points based on playhead + noisy inputs
        const noise = (Math.random() - 0.5) * 20;
        const baseHeight = 90 + Math.sin(x / 14 + currentTime) * 25 + waveOffset - exposureFactor;
        
        ctx.lineTo(x, Math.max(10, Math.min(canvas.height - 10, baseHeight + noise)));
      }
      ctx.stroke();

      // Draw secondary RGB Parade waveforms
      ctx.strokeStyle = "rgba(239, 68, 68, 0.25)"; // Red parade
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 2) {
        const noise = (Math.random() - 0.5) * 10;
        const rVal = 100 + Math.sin(x / 10) * 15 + noise - warmthFactor - exposureFactor;
        ctx.lineTo(x, Math.max(10, rVal));
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(59, 130, 246, 0.25)"; // Blue parade
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 2) {
        const noise = (Math.random() - 0.5) * 10;
        const bVal = 95 + Math.cos(x / 10 + 1) * 15 + noise + warmthFactor - exposureFactor;
        ctx.lineTo(x, Math.max(10, bVal));
      }
      ctx.stroke();

      // Vectorscope mini circle viewport rendering
      ctx.strokeStyle = "#222222";
      ctx.beginPath();
      ctx.arc(canvas.width - 60, canvas.height - 60, 42, 0, Math.PI * 2);
      ctx.stroke();

      // Vectorscope central vector blob
      ctx.fillStyle = "rgba(45, 212, 191, 0.65)";
      ctx.beginPath();
      const vx = canvas.width - 60 + warmthFactor / 1.5 + (Math.random() - 0.5) * 5;
      const vy = canvas.height - 60 + (Math.random() - 0.5) * 5;
      ctx.arc(vx, vy, 6, 0, Math.PI * 2);
      ctx.fill();

      // Labels the boxes R, G, B, Yl, Mg, Cy
      ctx.fillStyle = "#555555";
      ctx.font = "bold 8px monospace";
      ctx.fillText("VECTORSCOPE", canvas.width - 92, canvas.height - 10);
      ctx.fillText("HISTOGRAM / WAVEFORM", 10, 15);

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [activeTab, currentTime, selectedClip]);

  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(0);
  };

  useEffect(() => {
    let interval: any;
    if (isExporting) {
      interval = setInterval(() => {
        setExportProgress(old => {
          if (old >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsExporting(false);
              onExport(exportPlatform, exportRes, gpuAccelerated);
            }, 800);
            return 100;
          }
          return old + (gpuAccelerated ? 8 : 4); // GPU renders twice as fast
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isExporting, exportPlatform, exportRes, gpuAccelerated]);

  // Insert raw subclip from Source Monitor into active timeline track
  const handleInsertSourceClip = () => {
    if (!sourcePreviewAsset) return;
    if (!onAddAssetToTimeline) {
      alert("⚠️ Timeline offline para inserir este clipe.");
      return;
    }

    const duration = sourceOutPoint && sourceInPoint 
      ? (sourceOutPoint - sourceInPoint) 
      : sourcePreviewAsset.duration;

    const partialAsset: Asset = {
      ...sourcePreviewAsset,
      duration: Math.max(1, Math.min(60, duration))
    };

    onAddAssetToTimeline(partialAsset);
    alert(`📥 Sub-clipe de ${duration.toFixed(1)}s inserido com sucesso na timeline a partir da agulha.`);
  };

  // Curve Point Drag Listeners
  const handleCurveMouseDown = (id: string) => {
    setActivePointId(id);
  };

  const handleCurveMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!activePointId) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(180, e.clientX - rect.left));
    const y = Math.max(0, Math.min(180, e.clientY - rect.top));

    setCurvePoints(points => points.map(pt => {
      if (pt.id === activePointId) {
        return { ...pt, x, y };
      }
      return pt;
    }));

    // Trigger visual modifications in selected clip
    if (selectedClip && onUpdateFilters) {
      const contrastModifier = Math.floor((180 - y) / 1.8 + 50); // 50 to 150
      onUpdateFilters(selectedClip.id, { contrast: contrastModifier });
    }
  };

  const resetCurves = () => {
    setCurvePoints([
      { id: 'black', x: 0, y: 180, label: 'Shadows', active: false },
      { id: 'mid', x: 90, y: 90, label: 'Midtones', active: false },
      { id: 'white', x: 180, y: 0, label: 'Highlights', active: false }
    ]);
    if (selectedClip && onUpdateFilters) {
      onUpdateFilters(selectedClip.id, { contrast: 100 });
    }
  };

  // Smart Search simulation for generating local B-Roll with AI
  const handleTriggerAIBroll = () => {
    if (!smartBrollSearch.trim()) return;
    alert(`🤖 IA VisionCut vasculhou os bancos de dados do Drive e Unsplash para encontrar o B-Roll perfeito para '${smartBrollSearch}'. Registrado no Media Pool!`);
    setSmartBrollSearch("");
  };

  return (
    <div className="bg-neutral-900 border-l border-neutral-800 flex flex-col h-full select-none" style={{ minWidth: '450px' }}>
      
      {/* 4 Multi-tab header selector bar */}
      <div className="bg-neutral-950 p-1 flex items-center justify-between border-b border-neutral-800">
        <div className="flex gap-0.5">
          <button
            onClick={() => setActiveTab('program')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${activeTab === 'program' ? 'bg-neutral-900 text-teal-400 border border-teal-500/10' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Programa (V1)</span>
          </button>

          <button
            onClick={() => setActiveTab('source')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${activeTab === 'source' ? 'bg-neutral-900 text-teal-400 border border-teal-500/10' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Origem (Source)</span>
          </button>

          <button
            onClick={() => setActiveTab('grading')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${activeTab === 'grading' ? 'bg-neutral-900 text-teal-400 border border-teal-500/10' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>DaVinci Color</span>
          </button>

          <button
            onClick={() => setActiveTab('scopes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition ${activeTab === 'scopes' ? 'bg-neutral-900 text-teal-400 border border-teal-500/10' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Scopes</span>
          </button>
        </div>

        {/* Quality select dropdown & Premium Controls */}
        <div className="flex items-center gap-2.5 pr-2 flex-wrap">
          {/* Real Fit & Auto Fill switches */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded p-1">
            <button
              onClick={() => { setScalingMode('fit'); setZoomPercent('fit'); }}
              className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider transition ${scalingMode === 'fit' ? 'bg-teal-500 text-neutral-950 font-black' : 'text-neutral-400 hover:text-white'}`}
              title="Ajustar ao Monitor Real (Fit to Window)"
            >
              Fit Window
            </button>
            <button
              onClick={() => { setScalingMode('fill'); setZoomPercent('100%'); }}
              className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider transition ${scalingMode === 'fill' ? 'bg-teal-500 text-neutral-950 font-black' : 'text-neutral-400 hover:text-white'}`}
              title="Preenchimento Automático Máximo (Auto Fill)"
            >
              Auto Fill
            </button>
          </div>

          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded p-1">
            <button
              onClick={() => setDualMonitor(!dualMonitor)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 transition ${dualMonitor ? 'bg-teal-500 text-neutral-950 font-black' : 'text-neutral-400 hover:text-white'}`}
              title="Alternar Monitor Duplo Lado-a-Lado (Origem + Programa)"
            >
              <Layers className="w-3 h-3" />
              <span>DUPLO</span>
            </button>
            <button
              onClick={() => setIsCinema(!isCinema)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 transition ${isCinema ? 'bg-amber-500 text-neutral-950 font-black' : 'text-neutral-400 hover:text-white'}`}
              title="Ativar Cinema Mode (Pitch Black Focus View)"
            >
              <span>🍿 CINEMA</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-neutral-500 font-bold uppercase">Zoom:</span>
            <select
              value={zoomPercent}
              onChange={(e) => {
                setZoomPercent(e.target.value as any);
                if (e.target.value === 'fit') {
                  setScalingMode('fit');
                } else if (e.target.value === '200%' || e.target.value === '150%') {
                  setScalingMode('fill');
                }
              }}
              className="text-[10px] bg-neutral-900 border border-neutral-800 text-teal-400 rounded px-1 py-0.5 focus:outline-none"
            >
              <option value="fit">Ajustar (Fit)</option>
              <option value="50%">50%</option>
              <option value="100%">100%</option>
              <option value="150%">150%</option>
              <option value="200%">200%</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-neutral-500 font-bold uppercase">Proxy:</span>
            <select
              value={playbackQuality}
              onChange={(e) => setPlaybackQuality(e.target.value as any)}
              className="text-[10px] bg-neutral-900 border border-neutral-800 text-teal-400 rounded px-1.5 py-0.5 focus:outline-none"
            >
              <option value="full">Full Qual.</option>
              <option value="1/2">1/2 Proxy</option>
              <option value="1/4">1/4 Acel.</option>
              <option value="1/8">1/8 Fluid</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEWPORT CONTROLLER */}
      <div className="flex-1 flex flex-col min-h-0 bg-neutral-950/40 relative">
        
        {dualMonitor ? (
          <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-neutral-800 min-h-0">
            {/* Left element: Source */}
            <div className="flex-1 flex flex-col justify-between p-3 min-w-0 bg-neutral-950/20 text-left">
              <div className="bg-neutral-905 border border-neutral-800 p-2 text-[10px] font-bold text-teal-400 font-mono tracking-wider uppercase flex items-center justify-between rounded-t-lg bg-neutral-950">
                <span className="flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5" /> Monitor de Origem (Source)</span>
                <span className="text-[9px] text-neutral-500">Material Bruto</span>
              </div>
              <div className="flex-1 bg-black relative rounded-b-lg border-x border-b border-neutral-800 flex flex-col items-center justify-center overflow-hidden min-h-[220px]">
                {sourcePreviewAsset ? (
                  <div className="w-full h-full flex flex-col justify-between p-1">
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                      <img 
                        src={sourcePreviewAsset.url} 
                        alt="" 
                        className="max-h-full max-w-full object-contain filter grayscale-[0.25] saturate-[0.8]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-neutral-950/25 flex items-start p-3 pointer-events-none">
                        <span className="bg-red-500 text-white text-[9px] font-bold uppercase rounded px-1.5 py-0.5 tracking-widest">RAW MONITOR</span>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-neutral-900/90 border border-neutral-800 p-2 rounded text-[10px] flex justify-between text-neutral-400 font-mono">
                        <span>IN: {sourceInPoint ? `${sourceInPoint.toFixed(1)}s` : "Não definido"}</span>
                        <span>OUT: {sourceOutPoint ? `${sourceOutPoint.toFixed(1)}s` : "Não definido"}</span>
                      </div>
                    </div>
                    {/* Local scrubber */}
                    <div className="bg-neutral-950 p-2 rounded flex items-center gap-2">
                      <span className="text-[9px] font-mono text-neutral-500">{formatTime(sourceTime)}</span>
                      <input 
                        type="range"
                        min="0"
                        max={sourcePreviewAsset.duration}
                        step="0.1"
                        value={sourceTime}
                        onChange={(e) => setSourceTime(parseFloat(e.target.value))}
                        className="flex-1 accent-indigo-400 h-1 bg-neutral-800 cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 text-neutral-500 text-xs">Arraste mídia para preview</div>
                )}
              </div>
              {/* Source Controls */}
              <div className="p-2 bg-neutral-950 border border-neutral-850 rounded-lg flex items-center justify-between mt-2">
                <div className="flex gap-1.5">
                  <button onClick={() => setSourceInPoint(sourceTime)} className="px-2 py-1 bg-neutral-900 text-[9px] font-mono text-teal-400 border border-neutral-800 rounded font-bold hover:bg-neutral-800 select-none">
                    [ IN
                  </button>
                  <button onClick={() => setSourceOutPoint(sourceTime)} className="px-2 py-1 bg-neutral-900 text-[9px] font-mono text-teal-400 border border-neutral-800 rounded font-bold hover:bg-neutral-800 select-none">
                    OUT ]
                  </button>
                </div>
                <button
                  onClick={() => setSourceIsPlaying(!sourceIsPlaying)}
                  className={`px-3 py-1 rounded text-[9px] font-mono font-bold transition ${sourceIsPlaying ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 text-teal-400 border border-neutral-800'}`}
                >
                  {sourceIsPlaying ? "PAUSAR" : "TOCAR BRUTO"}
                </button>
              </div>
            </div>

            {/* Right element: Program */}
            <div className="flex-1 flex flex-col justify-between p-3 min-w-0 bg-neutral-950/20 text-left">
              <div className="bg-neutral-901 border border-neutral-800 p-2 text-[10px] font-bold text-teal-400 font-mono tracking-wider uppercase flex items-center justify-between rounded-t-lg bg-neutral-950">
                <span className="flex items-center gap-1.5"><Tv className="w-3.5 h-3.5" /> Monitor de Programa (V1 Output)</span>
                <span className="text-[9px] text-neutral-500">Linha de Edição</span>
              </div>
              <div className="flex-1 bg-black relative flex items-center justify-center p-2 overflow-hidden min-h-[220px] rounded-b-lg border-x border-b border-neutral-800">
                <div className="w-[96%] h-[92%] bg-neutral-950 relative rounded-lg border border-neutral-850 shadow-2xl overflow-hidden flex items-center justify-center">
                  {activeVisualClip ? (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                      <img
                        src={activeVisualClip.url}
                        alt=""
                        className={`w-full h-full ${scalingMode === 'fill' ? 'object-cover' : 'object-contain'} transition-all ${getLutClass(activeVisualClip)}`}
                        style={{
                          ...getFilterStyle(activeVisualClip),
                          ...getMotionStyle(activeVisualClip),
                          ...getZoomStyle()
                        }}
                        referrerPolicy="no-referrer"
                      />
                      {activeSubtitle && (
                        <div className="absolute bottom-4 left-2 right-2 text-center z-20 pointer-events-none">
                          <span className="bg-black/95 text-yellow-300 px-2.5 py-1.5 rounded text-[10px] font-bold border border-neutral-800 shadow">
                            {activeSubtitle.translatedText || activeSubtitle.text}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-neutral-500">Sem clipe</p>
                  )}
                </div>
              </div>
              {/* Program Controls */}
              <div className="bg-neutral-950 p-2 border border-neutral-850 rounded-lg flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={onTogglePlay} className="p-2 bg-teal-500 text-neutral-950 rounded-full hover:bg-teal-400">
                    {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                  </button>
                  <span className="font-mono text-[10px] text-teal-400 font-bold bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">{formatTime(currentTime)}</span>
                </div>
                <button onClick={handleStartExport} className="px-3 py-1 bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-neutral-950 transition text-[10px] font-bold rounded border border-teal-500/25">EXPORTAR</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* TAB 1: PROGRAM MONITOR PREVIEW */}
            {activeTab === 'program' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Playback Container */}
            <div className="flex-1 bg-black relative flex items-center justify-center p-3 overflow-hidden">
              <div className="w-[96%] h-[92%] bg-neutral-950 relative rounded-lg border border-neutral-800 shadow-2xl overflow-hidden flex items-center justify-center">
                
                {activeVisualClip ? (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                    {/* Background removal or chromakey alerts overlay */}
                    {activeVisualClip.chromaKey?.enabled && (
                      <div className="absolute inset-0 bg-emerald-950/45 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400 tracking-wider z-10 pointer-events-none uppercase font-bold">
                        ⭐ Chroma key ativo (RGB: {activeVisualClip.chromaKey.color})
                      </div>
                    )}
                    {activeVisualClip.aiBackgroundRemoval && (
                      <div className="absolute inset-0 bg-blue-950/20 border border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 tracking-wider z-10 pointer-events-none uppercase font-bold">
                        🧙‍♂️ IA Background Removido
                      </div>
                    )}

                    <img
                      src={activeVisualClip.url}
                      alt={activeVisualClip.name}
                      className={`w-full h-full ${scalingMode === 'fill' ? 'object-cover' : 'object-contain'} transition-all ${getLutClass(activeVisualClip)}`}
                      style={{
                        ...getFilterStyle(activeVisualClip),
                        ...getMotionStyle(activeVisualClip),
                        ...getZoomStyle()
                      }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Styled subtitle overlay */}
                    {activeSubtitle && (
                      <div className="absolute bottom-5 left-4 right-4 text-center z-20 pointer-events-none">
                        <span className="bg-black/90 text-yellow-300 px-3 py-2 rounded-lg text-xs font-bold tracking-wide border border-neutral-800 shadow-md">
                          {activeSubtitle.translatedText ? (
                            <span className="flex flex-col">
                              <span className="text-[10px] text-neutral-400 font-normal line-through opacity-50 block mb-0.5">{activeSubtitle.text}</span>
                              <span className="text-white">{activeSubtitle.translatedText}</span>
                            </span>
                          ) : (
                            activeSubtitle.text
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <span className="w-12 h-12 rounded-full border-2 border-dashed border-neutral-800 flex items-center justify-center mx-auto mb-2 text-neutral-600">
                      🎬
                    </span>
                    <p className="text-xs text-neutral-500 font-bold tracking-tight">Timeline vazia neste ponto</p>
                    <p className="text-[10px] text-neutral-600 mt-1">Coloque clipes na timeline para reproduzir</p>
                  </div>
                )}

                {/* Grid overlays */}
                {showGrid && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-30">
                    <div className="border-r border-b border-dashed border-teal-400/30"></div>
                    <div className="border-r border-b border-dashed border-teal-400/30"></div>
                    <div className="border-b border-dashed border-teal-400/30"></div>
                    <div className="border-r border-b border-dashed border-teal-400/30"></div>
                    <div className="border-r border-b border-dashed border-teal-400/30"></div>
                    <div className="border-b border-dashed border-teal-400/30"></div>
                  </div>
                )}

                {safeArea && (
                  <div className="absolute inset-[10%] border-2 border-dashed border-red-500/20 pointer-events-none z-30 flex items-end justify-between p-1">
                    <span className="text-[8px] text-red-400/60 uppercase tracking-widest leading-none select-none">Action Safe 90%</span>
                    <span className="text-[8px] text-red-400/60 uppercase tracking-widest leading-none select-none">Title Safe 80%</span>
                  </div>
                )}

                {zebraExposure && (
                  <div 
                    className="absolute inset-0 pointer-events-none z-35 mix-blend-difference opacity-50"
                    style={{
                      background: 'repeating-linear-gradient(45deg, rgba(234, 179, 8, 0.4) 0px, rgba(234, 179, 8, 0.4) 10px, transparent 10px, transparent 20px)'
                    }}
                  />
                )}

                {focusPeaking && (
                  <div className="absolute inset-0 pointer-events-none z-35 mix-blend-screen opacity-70">
                    <svg className="w-full h-full">
                      <path d="M 50 120 Q 150 40 250 120 T 350 120" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 4" />
                      <path d="M 10 200 L 400 200" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2 3" />
                      <circle cx="150" cy="80" r="1.5" fill="#22d3ee" />
                      <circle cx="210" cy="110" r="2" fill="#22d3ee" />
                      <circle cx="80" cy="140" r="1" fill="#22d3ee" />
                    </svg>
                  </div>
                )}

                {pixelGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none z-35 opacity-25 mix-blend-overlay"
                    style={{
                      backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)',
                      backgroundSize: '3px 3px'
                    }}
                  />
                )}

                {/* cinematic letterbox crop preset simulation */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-black pointer-events-none opacity-80 z-20"></div>
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-black pointer-events-none opacity-80 z-20"></div>
              </div>
            </div>

            {/* Quick overlay options */}
            <div className="bg-neutral-950 px-4 py-2 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] text-neutral-550 uppercase font-mono tracking-wider flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-teal-400 animate-spin" /> Render Cache: 100% (Acel. GPU)
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-2 py-1 text-[9px] font-bold rounded border transition ${showGrid ? 'bg-teal-500/10 text-teal-400 border-teal-500/25' : 'text-neutral-500 border-transparent hover:text-neutral-300'}`}
                  title="Superpor Grade Grid de Terços para Regra dos Terços"
                >
                  <Grid className="w-3 h-3" /> GRADE de TERÇOS
                </button>
                <button
                  onClick={() => setSafeArea(!safeArea)}
                  className={`px-2 py-1 text-[9px] font-bold rounded border transition ${safeArea ? 'bg-teal-500/10 text-teal-400 border-teal-500/25' : 'text-neutral-500 border-transparent hover:text-neutral-300'}`}
                  title="Margens de segurança Action Safe / Title Safe"
                >
                  <Maximize className="w-3 h-3" /> MARGENS SEGURAS
                </button>
                <button
                  onClick={() => setZebraExposure(!zebraExposure)}
                  className={`px-2 py-1 text-[9px] font-bold rounded border transition ${zebraExposure ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/25 animate-pulse' : 'text-neutral-500 border-transparent hover:text-neutral-300'}`}
                  title="Ativar listras Zebra para áreas de superexposição"
                >
                  🦓 ZEBRA 70IRE
                </button>
                <button
                  onClick={() => setFocusPeaking(!focusPeaking)}
                  className={`px-2 py-1 text-[9px] font-bold rounded border transition ${focusPeaking ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25 font-extrabold' : 'text-neutral-500 border-transparent hover:text-neutral-300'}`}
                  title="Ativar contornos Focus Peaking para nitidez de foco"
                >
                  🎯 PEAKING FOCO
                </button>
                <button
                  onClick={() => setPixelGrid(!pixelGrid)}
                  className={`px-2 py-1 text-[9px] font-bold rounded border transition ${pixelGrid ? 'bg-indigo-505 bg-indigo-500/10 text-indigo-400 border-indigo-500/25' : 'text-neutral-500 border-transparent hover:text-neutral-300'}`}
                  title="Ativar visualizador de malha de sub-pixels"
                >
                  📺 PIXEL GRID
                </button>
                <button
                  onClick={() => setHdrPreview(!hdrPreview)}
                  className={`px-2 py-1 text-[9px] font-bold rounded border transition ${hdrPreview ? 'bg-orange-550/15 bg-orange-500/15 text-orange-400 border-orange-500/30' : 'text-neutral-500 border-transparent hover:text-neutral-300'}`}
                  title="Ativar preview HDR simulado (Contraste e saturação expandidos)"
                >
                  🔥 HDR PREVIEW
                </button>
              </div>
            </div>

            {/* Scrubber playback deck */}
            <div className="bg-neutral-950 p-4 border-t border-neutral-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-teal-400 font-bold bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded">
                  {formatTime(currentTime)}
                </span>
                
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => onSetCurrentTime(parseFloat(e.target.value))}
                  className="flex-1 accent-teal-400 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                />

                <span className="font-mono text-xs text-neutral-500 px-1">
                  {formatTime(60.0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSetCurrentTime(0)}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition"
                    title="Voltar ao início"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSetCurrentTime(Math.max(0, currentTime - 1))}
                    className="px-2 py-1 text-[10px] font-mono font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition"
                  >
                    -1s
                  </button>
                  
                  <button
                    onClick={onTogglePlay}
                    className={`mx-1 p-3 rounded-full flex items-center justify-center transition border ${isPlaying ? 'bg-amber-600/10 text-amber-500 border-amber-500/30' : 'bg-teal-500 text-neutral-950 hover:bg-teal-400 border-transparent'}`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={() => onSetCurrentTime(Math.min(60, currentTime + 1))}
                    className="px-2 py-1 text-[10px] font-mono font-bold text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition"
                  >
                    +1s
                  </button>
                  <button
                    onClick={() => onSetCurrentTime(60)}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition"
                    title="Avançar ao fim"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleStartExport}
                    className="px-3.5 py-2 bg-neutral-800 hover:bg-teal-500 hover:text-neutral-950 text-teal-400 font-bold text-[11px] rounded transition flex items-center gap-1.5 border border-teal-500/15"
                  >
                    <Download className="w-4 h-4" /> EXPORTAR PRO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOURCE MONITOR (RAW CLIPS PREVIEW) */}
        {activeTab === 'source' && (
          <div className="flex-1 flex flex-col justify-between p-4 space-y-4">
            
            <div className="flex-1 bg-black relative rounded-lg border border-neutral-800 flex flex-col items-center justify-center overflow-hidden">
              {sourcePreviewAsset ? (
                <div className="w-full h-full flex flex-col justify-between p-1">
                  
                  {/* Raw frame thumbnail display */}
                  <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                    <img 
                      src={sourcePreviewAsset.url} 
                      alt="" 
                      className="max-h-full max-w-full object-contain filter grayscale-[0.25] saturate-[0.8]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-neutral-950/25 flex items-start p-3 pointer-events-none">
                      <span className="bg-red-500 text-white text-[9px] font-bold uppercase rounded px-1.5 py-0.5 tracking-widest">RAW MONITOR</span>
                    </div>

                    {/* IN - OUT Marker line segments indicator */}
                    <div className="absolute bottom-2 left-2 right-2 bg-neutral-900/90 border border-neutral-800 p-2 rounded text-[10px] flex justify-between text-neutral-400 font-mono">
                      <span>IN: {sourceInPoint ? `${sourceInPoint.toFixed(1)}s` : "Não definido"}</span>
                      <span>OUT: {sourceOutPoint ? `${sourceOutPoint.toFixed(1)}s` : "Não definido"}</span>
                      <span className="text-teal-400 font-bold">Sub-Span: {(sourceOutPoint && sourceInPoint ? (sourceOutPoint - sourceInPoint) : sourcePreviewAsset.duration).toFixed(1)}s</span>
                    </div>
                  </div>

                  {/* Local scrubber bar */}
                  <div className="bg-neutral-950 p-2 rounded flex items-center gap-3">
                    <span className="text-[10px] font-mono text-neutral-500">{formatTime(sourceTime)}</span>
                    <input 
                      type="range"
                      min="0"
                      max={sourcePreviewAsset.duration}
                      step="0.1"
                      value={sourceTime}
                      onChange={(e) => setSourceTime(parseFloat(e.target.value))}
                      className="flex-1 accent-indigo-400 h-1 bg-neutral-800 cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-neutral-500">{formatTime(sourcePreviewAsset.duration)}</span>
                  </div>

                </div>
              ) : (
                <div className="text-center p-6 text-neutral-500 text-xs">
                  <p>Arraste algum arquivo ou clique no botão + registrar na aba "Mídia" para pré-visualizar o material bruto neste monitor.</p>
                </div>
              )}
            </div>

            {/* In / Out controllers */}
            <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setSourceInPoint(sourceTime)}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[10px] font-mono text-teal-400 border border-neutral-800 hover:border-teal-500/20 rounded font-bold transition"
                  title="Marcar ponto de entrada do corte"
                >
                  [ MARCAR ENTRADA (I)
                </button>
                <button
                  onClick={() => setSourceOutPoint(sourceTime)}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-[10px] font-mono text-teal-400 border border-neutral-800 hover:border-teal-500/20 rounded font-bold transition"
                  title="Marcar ponto de saída"
                >
                  MARCAR SAÍDA (O) ]
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSourceIsPlaying(!sourceIsPlaying)}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 rounded font-bold text-xs hover:text-white"
                >
                  {sourceIsPlaying ? "PAUSA" : "REPRODUZIR BRUTO"}
                </button>
                <button
                  onClick={handleInsertSourceClip}
                  disabled={!sourcePreviewAsset}
                  className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold uppercase text-[10px] rounded flex items-center gap-1 disabled:opacity-40"
                  title="Insere a seleção definida na timeline principal"
                >
                  <Plus className="w-3.5 h-3.5" /> INSERIR NA TIMELINE (,)
                </button>
              </div>
            </div>

            {/* Smart generation generator B-ROLL */}
            <div className="p-3 bg-gradient-to-r from-neutral-925 to-indigo-950/20 border border-indigo-500/15 rounded-lg flex flex-col gap-2">
              <span className="text-[10px] font-bold text-indigo-400 block uppercase tracking-wide">Geração Inteligente de B-Roll (Banco Online AI)</span>
              <p className="text-[10px] text-neutral-400">Descreva o cenário que você precisa. A IA buscará e gerará uma sugestão de cena em segundos:</p>
              
              <div className="flex gap-1.5">
                <input 
                  type="text" 
                  placeholder="Ex: Drone sobrevoando montanhas nevadas ao pôr-do-sol" 
                  value={smartBrollSearch}
                  onChange={(e) => setSmartBrollSearch(e.target.value)}
                  className="flex-1 bg-neutral-950 p-1.5 border border-neutral-800 rounded text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handleTriggerAIBroll}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded transition uppercase flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Buscar
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: DAVINCI COLOR GRADING (CURVES AND THREE COLOR WHEELS) */}
        {activeTab === 'grading' && (
          <div className="flex-1 flex flex-col p-4 bg-neutral-950 overflow-y-auto space-y-4 text-left">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div>
                <span className="text-[10px] text-teal-400 font-bold uppercase block">DaVinci Resolve Studio Deck</span>
                <span className="text-xs text-white">Graduação de Cor Não Destrutiva</span>
              </div>
              <button 
                onClick={resetCurves}
                className="px-2.5 py-1 text-[9px] bg-neutral-900 border border-neutral-800 rounded font-mono text-neutral-400 hover:text-white"
              >
                Reset GERAL
              </button>
            </div>

            {/* Dynamic Curve block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Curve chart */}
              <div className="p-3 bg-neutral-925 border border-neutral-850 rounded-xl relative">
                <span className="text-[10px] text-neutral-400 font-mono block mb-2 uppercase">RGB curves (Curva Paramétrica)</span>
                
                <svg 
                  className="w-full h-40 bg-neutral-950 border border-neutral-850 rounded relative cursor-crosshair overflow-visible"
                  onMouseMove={handleCurveMouseMove}
                  onMouseUp={() => setActivePointId(null)}
                >
                  {/* Grid lines inside */}
                  <line x1="0" y1="40" x2="200" y2="40" stroke="#1d1d1d" strokeDasharray="3" />
                  <line x1="0" y1="80" x2="200" y2="80" stroke="#1d1d1d" strokeDasharray="3" />
                  <line x1="0" y1="120" x2="200" y2="120" stroke="#1d1d1d" strokeDasharray="3" />
                  <line x1="50" y1="0" x2="50" y2="160" stroke="#1d1d1d" strokeDasharray="3" />
                  <line x1="100" y1="0" x2="100" y2="160" stroke="#1d1d1d" strokeDasharray="3" />
                  <line x1="150" y1="0" x2="150" y2="160" stroke="#1d1d1d" strokeDasharray="3" />

                  {/* Bezier visual lines */}
                  <path 
                    d={`M 0 160 Q ${curvePoints[1].x} ${curvePoints[1].y} 200 0`} 
                    fill="none" 
                    stroke="url(#gradient-curves)" 
                    strokeWidth="2.5" 
                  />

                  {/* Points anchors */}
                  {curvePoints.map((pt) => (
                    <circle
                      key={pt.id}
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill="#2dd4bf"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      onMouseDown={() => handleCurveMouseDown(pt.id)}
                      className="cursor-pointer hover:scale-125 transition-transform"
                    />
                  ))}

                  <defs>
                    <linearGradient id="gradient-curves" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>

                <p className="text-[9px] text-neutral-500 mt-2 font-mono text-center">Clique e arraste os âncoras para distorcer a curva de contraste</p>
              </div>

              {/* RGB Mixer parameters */}
              <div className="p-3 bg-neutral-925 border border-neutral-850 rounded-xl space-y-2.5">
                <span className="text-[10px] text-neutral-400 font-mono block uppercase">Mixer RGB (Ganhos de Canal)</span>
                
                <div>
                  <div className="flex justify-between text-[9px] text-red-400 font-mono">
                    <span>CANAL VERMELHO (Red Gain)</span>
                    <span>{rgbMixerRed}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="150" 
                    value={rgbMixerRed} 
                    onChange={(e) => setRgbMixerRed(parseInt(e.target.value))}
                    className="w-full h-1 accent-red-500 bg-neutral-850 rounded"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-green-400 font-mono">
                    <span>CANAL VERDE (Green Gain)</span>
                    <span>{rgbMixerGreen}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="150" 
                    value={rgbMixerGreen} 
                    onChange={(e) => setRgbMixerGreen(parseInt(e.target.value))}
                    className="w-full h-1 accent-emerald-500 bg-neutral-850 rounded"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-blue-400 font-mono">
                    <span>CANAL AZUL (Blue Gain)</span>
                    <span>{rgbMixerBlue}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="150" 
                    value={rgbMixerBlue} 
                    onChange={(e) => {
                      setRgbMixerBlue(parseInt(e.target.value));
                      if (selectedClip && onUpdateColorGrading) {
                        onUpdateColorGrading(selectedClip.id, { temp: Math.floor((parseInt(e.target.value) - 100) / 2) });
                      }
                    }}
                    className="w-full h-1 accent-blue-500 bg-neutral-850 rounded"
                  />
                </div>

                <div className="p-2 bg-neutral-950 rounded text-[9px] text-neutral-500 leading-relaxed font-mono">
                  💡 Os mixers interagem em tempo real com o motor rasterizador da GPU integrado em VisionCut Pro.
                </div>
              </div>
            </div>

            {/* THREE WHEELS: LIFT, GAMMA, GAIN */}
            <div className="space-y-2">
              <span className="text-[10px] text-neutral-400 font-mono block uppercase">Círculo Cromático de Três Vias (Color Wheels)</span>
              
              <div className="grid grid-cols-3 gap-3">
                
                {/* 1. LIFT WHEEL */}
                <div className="p-2 bg-neutral-925 border border-neutral-850 rounded-xl text-center space-y-2">
                  <span className="text-[9px] text-neutral-400 font-bold tracking-widest block uppercase">LIFT (Sombras)</span>
                  <div className="mx-auto relative w-24 h-24 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center p-1">
                    <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950"></div>
                    <div 
                      className="absolute w-3 h-3 rounded-full bg-teal-400 border border-white cursor-pointer shadow-lg hover:scale-125 transition-transform" 
                      style={{ transform: `translate(${liftJoy.x}px, ${liftJoy.y}px)` }}
                      title="Lift joystick tracker"
                    ></div>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 block">Contrast Lift: -1.2dB</span>
                </div>

                {/* 2. GAMMA WHEEL */}
                <div className="p-2 bg-neutral-925 border border-neutral-850 rounded-xl text-center space-y-2">
                  <span className="text-[9px] text-neutral-400 font-bold tracking-widest block uppercase">GAMMA (Tons Médios)</span>
                  <div className="mx-auto relative w-24 h-24 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center p-1">
                    <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950"></div>
                    <div 
                      className="absolute w-3 h-3 rounded-full bg-teal-400 border border-white cursor-pointer shadow-lg hover:scale-125 transition-transform" 
                      style={{ transform: `translate(${gammaJoy.x}px, ${gammaJoy.y}px)` }}
                    ></div>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 block">Gamma Midtones: +0.4</span>
                </div>

                {/* 3. GAIN WHEEL */}
                <div className="p-2 bg-neutral-925 border border-neutral-850 rounded-xl text-center space-y-2">
                  <span className="text-[9px] text-neutral-400 font-bold tracking-widest block uppercase">GAIN (Altas Luzes)</span>
                  <div className="mx-auto relative w-24 h-24 rounded-full border border-neutral-800 bg-neutral-950 flex items-center justify-center p-1">
                    <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-neutral-950"></div>
                    <div 
                      className="absolute w-3 h-3 rounded-full bg-teal-400 border border-white cursor-pointer shadow-lg hover:scale-125 transition-transform" 
                      style={{ transform: `translate(${gainJoy.x}px, ${gainJoy.y}px)` }}
                    ></div>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 block">Gain Highlights: +2.1dB</span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 4: VIDEOSCOPES (WAVEFORM & HISTOGRAM GRAPHICS) */}
        {activeTab === 'scopes' && (
          <div className="flex-1 flex flex-col p-4 bg-neutral-950 text-left space-y-4">
            <div>
              <span className="text-[10px] text-teal-400 font-bold block uppercase tracking-wider">Scopes Vetoriais de Alta Performance (HUD)</span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Analise balanço de branco, luminância e níveis de cor de forma rasterizada</span>
            </div>

            <div className="flex-1 bg-neutral-925 rounded-xl border border-neutral-850 p-3 flex flex-col relative overflow-hidden">
              <canvas 
                ref={scopesCanvasRef} 
                className="w-full flex-1 rounded bg-black shadow border border-neutral-900"
                width={380}
                height={260}
              />
            </div>

            <div className="p-3 bg-neutral-925 border border-neutral-850 rounded-xl grid grid-cols-2 gap-4 text-[10px]">
              <div>
                <span className="text-[9px] text-neutral-500 font-mono block uppercase">Balanço de Cromatismo</span>
                <p className="text-neutral-400 leading-relaxed mt-0.5">O Vectorscope confirma níveis ótimos de saturação, prevenindo estouros no canal de broadcast H.264.</p>
              </div>
              <div>
                <span className="text-[9px] text-neutral-500 font-mono block uppercase">RGB Parade</span>
                <p className="text-neutral-400 leading-relaxed mt-0.5">Fornece o alinhamento individual de canais de cor RGB para nitidez de pretos absolutos.</p>
              </div>
            </div>

          </div>
        )}
          </>
        )}

      </div>

      {/* RENDER EXPORT MODAL PANEL OVERLAY DRAWER */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full text-left shadow-2xl">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-lg mb-2">
              <Cpu className="w-6 h-6 animate-spin text-teal-400" />
              <span>Exportar e Codificar Master</span>
            </div>
            <p className="text-xs text-neutral-400 mb-6 font-medium">Exportando seu projeto a partir da trilha multipista não destrutiva.</p>

            <div className="space-y-4 mb-6 text-xs text-left">
              
              <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">Destinação / Perfil</label>
                <select 
                  value={exportPlatform}
                  onChange={(e) => setExportPlatform(e.target.value)}
                  className="w-full text-xs bg-neutral-950 text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  <option value="youtube">YouTube (16:9 H.264 High Profile)</option>
                  <option value="tiktok">TikTok (9:16 Vertical Crop)</option>
                  <option value="twitch">Twitch Stream (60fps Constant Bitrate)</option>
                  <option value="instagram">Instagram Reels (Vertical High Bitrate)</option>
                  <option value="facebook">Facebook Video</option>
                  <option value="linkedin">LinkedIn Business Master</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">Resolução de Saída</label>
                  <select 
                    value={exportRes}
                    onChange={(e) => setExportRes(e.target.value)}
                    className="w-full text-xs bg-neutral-950 text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  >
                    <option value="720p">720p HD Ready</option>
                    <option value="1080p">1080p Full HD (Recomendado)</option>
                    <option value="1440p">1440p 2K Pro</option>
                    <option value="4K">4K Ultra HD (3840x2160)</option>
                    <option value="8K">8K Cinema Master (Aceleração Exclusiva)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">Codec de Compressão</label>
                  <select 
                    value={exportCodec}
                    onChange={(e) => setExportCodec(e.target.value)}
                    className="w-full text-xs bg-neutral-950 text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  >
                    <option value="h264">H264 (Compatibilidade Universal)</option>
                    <option value="h265">HEVC / H265 (Excelente Compressão)</option>
                    <option value="prores">Apple ProRes 422 HQ (HQ Master Lossless)</option>
                    <option value="dnxhd">Avid DNxHD (Broadcast Standard)</option>
                    <option value="av1">AOMedia AV1 (Ultra-Alta Eficiência)</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-neutral-950 rounded border border-neutral-850 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Aceleração de Hardware por GPU</span>
                    <span className="text-[9px] text-neutral-500 font-medium">Renderiza 200% mais veloz usando núcleos dedicados</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={gpuAccelerated} 
                    onChange={(e) => setGpuAccelerated(e.target.checked)}
                    className="rounded text-teal-400 bg-neutral-900 focus:ring-0 w-4 h-4"
                  />
                </div>

                {gpuAccelerated && (
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">API Gráfica Utilizada</label>
                    <select 
                      value={hardwareApi}
                      onChange={(e) => setHardwareApi(e.target.value)}
                      className="w-full text-[10px] bg-neutral-900 text-white rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-teal-400"
                    >
                      <option value="cuda">Mecanismo NVIDIA CUDA</option>
                      <option value="opencl">Apple Metal OpenCL</option>
                      <option value="directx">DirectX 12 API Workloads</option>
                      <option value="vulkan">Vulkan Engine Core v1.3</option>
                    </select>
                  </div>
                )}
              </div>

            </div>

            {/* Progress bar */}
            <div className="space-y-2 mt-6">
              <div className="flex justify-between text-xs font-mono text-neutral-400">
                <span>Codificando trilhas de vídeo e áudio ({exportCodec.toUpperCase()} @ {exportRes})...</span>
                <span className="font-bold text-white">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <div className="text-[9px] text-neutral-500 font-mono text-center">Background render ativado • Estimando 12 segundos restantes</div>
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setIsExporting(false)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white bg-neutral-800 rounded font-semibold transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🍿 CINEMA MODE INTERACTIVE OVERLAY */}
      {isCinema && (
        <div className="fixed inset-0 bg-neutral-950 z-[200] flex flex-col justify-between p-6 overflow-hidden select-none animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="text-xs font-black tracking-widest text-amber-500 font-mono uppercase flex items-center gap-2">
              🍿 VISIONCUT CLASSIC CINEMA SCREENING
            </span>
            <button 
              onClick={() => setIsCinema(false)}
              className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-850 rounded-full text-xs text-neutral-400 hover:text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Sair do Cinema</span>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="w-full max-w-4xl aspect-video bg-black relative rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden flex items-center justify-center">
              {activeVisualClip ? (
                <>
                  <img
                    src={activeVisualClip.url}
                    alt=""
                    className={`w-full h-full object-cover ${getLutClass(activeVisualClip)}`}
                    style={{
                      ...getFilterStyle(activeVisualClip),
                      ...getMotionStyle(activeVisualClip),
                      ...getZoomStyle()
                    }}
                    referrerPolicy="no-referrer"
                  />
                  {activeSubtitle && (
                    <div className="absolute bottom-6 left-6 right-6 text-center z-20">
                      <span className="bg-black/95 text-yellow-300 px-4 py-2 text-sm rounded-lg font-bold border border-neutral-800 shadow-2xl">
                        {activeSubtitle.translatedText || activeSubtitle.text}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-neutral-500 font-mono">Nenhum clipe ativo na timeline</p>
              )}
            </div>

            {/* Flat high-contrast Cinema Scrubber Overlay */}
            <div className="bg-neutral-900/90 border border-neutral-850/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl max-w-2xl w-full">
              <button onClick={() => onSetCurrentTime(0)} className="text-neutral-400 hover:text-white transition"><SkipBack className="w-4 h-4" /></button>
              <button 
                onClick={onTogglePlay} 
                className="p-3 bg-amber-500 text-neutral-950 rounded-full hover:bg-amber-400 shadow-lg transition-transform hover:scale-105"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <span className="font-mono text-xs text-amber-500 font-bold">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="60"
                step="0.1"
                value={currentTime}
                onChange={(e) => onSetCurrentTime(parseFloat(e.target.value))}
                className="flex-1 accent-amber-500 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
              />
              <span className="font-mono text-xs text-neutral-500">{formatTime(60.0)}</span>
            </div>
          </div>

          <div className="p-3 text-center text-[10px] text-neutral-600 font-mono">
            Pressione Esc ou clique no botão Sair para retornar à área de trabalho multipista.
          </div>
        </div>
      )}

    </div>
  );
}
