import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Project, 
  Clip, 
  Track, 
  Subtitle, 
  Marker, 
  Asset, 
  Version, 
  CollaborationComment,
  VideoFilters,
  ColorGrading,
  MotionParams,
  AudioSettings,
  ProductivityStats
} from "./types";
import { 
  INITIAL_TRACKS, 
  INITIAL_CLIPS, 
  INITIAL_SUBTITLES, 
  INITIAL_MARKERS, 
  MOCK_SHORTCUTS 
} from "./data/mockAssets";

// Sub-components
import Sidebar from "./components/Sidebar";
import Monitor from "./components/Monitor";
import AudioMixer from "./components/AudioMixer";
import Timeline from "./components/Timeline";
import AIInspector from "./components/AIInspector";
import Dashboard from "./components/Dashboard";

// Icons
import { 
  Sparkles, 
  Undo2, 
  Redo2, 
  Moon, 
  Sun, 
  Layout, 
  FileVideo, 
  Save, 
  Download, 
  Award, 
  MessageSquare,
  Volume2, 
  Settings,
  ShieldAlert,
  Info,
  Calendar,
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Settings2,
  ExternalLink,
  Type,
  Sliders,
  FolderOpen
} from "lucide-react";

export default function App() {
  // System general layouts states
  const [workspaceMode, setWorkspaceMode] = useState<'editor' | 'dashboard'>('editor');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);

  // Layout states for VisionCut Pro professional workspace resizing and docking
  const [layoutMode, setLayoutMode] = useState<'EDITING' | 'COLOR' | 'AUDIO' | 'MOTION' | 'IA_STUDIO' | 'MULTICAM' | 'STREAMING' | 'CINEMA'>('EDITING');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [sidebarState, setSidebarState] = useState<'normal' | 'collapsed' | 'detached' | 'fullscreen'>('normal');
  const [sidebarActiveTab, setSidebarActiveTab] = useState<'media' | 'effects' | 'text' | 'marketplace' | 'templates'>('media');
  const [aiInspectorState, setAiInspectorState] = useState<'normal' | 'collapsed' | 'detached' | 'fullscreen'>('normal');
  const [audioMixerState, setAudioMixerState] = useState<'normal' | 'collapsed' | 'detached' | 'fullscreen'>('collapsed');
  
  // Custom docked dimensions
  const [sidebarWidth, setSidebarWidth] = useState<number>(310);
  const [aiInspectorWidth, setAiInspectorWidth] = useState<number>(280);
  const [timelineHeight, setTimelineHeight] = useState<number>(280);

  // Resize indicator
  const [resizing, setResizing] = useState<'sidebar' | 'ai' | 'timeline' | null>(null);

  // Detached floats coordinates
  const [panelPositions, setPanelPositions] = useState({
    sidebar: { x: 80, y: 140 },
    ai: { x: 800, y: 140 },
    mixer: { x: 380, y: 410 }
  });
  const [draggingPanel, setDraggingPanel] = useState<'sidebar' | 'ai' | 'mixer' | null>(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });

  const [monitorTabOverride, setMonitorTabOverride] = useState<'program' | 'source' | 'grading' | 'scopes' | undefined>(undefined);
  const [dualMonitorActive, setDualMonitorActive] = useState<boolean>(false);
  const [aiInspectorTabOverride, setAiInspectorTabOverride] = useState<'transformacao' | 'cor' | 'audio' | 'texto' | 'motion' | 'ai' | undefined>(undefined);

  // DRAGGING EVENT HANDLERS
  const startDraggingPanel = (e: React.MouseEvent, panelName: 'sidebar' | 'ai' | 'mixer') => {
    setDraggingPanel(panelName);
    dragStartOffset.current = {
      x: e.clientX - panelPositions[panelName].x,
      y: e.clientY - panelPositions[panelName].y
    };
  };

  useEffect(() => {
    const handleDragMove = (e: MouseEvent) => {
      if (!draggingPanel) return;
      const newX = e.clientX - dragStartOffset.current.x;
      const newY = e.clientY - dragStartOffset.current.y;
      setPanelPositions(prev => ({
        ...prev,
        [draggingPanel]: { x: newX, y: newY }
      }));
    };

    const handleDragUp = () => {
      setDraggingPanel(null);
    };

    if (draggingPanel) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragUp);
    };
  }, [draggingPanel]);

  // DRAG RESIZING HANDLERS
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing) return;
      if (resizing === 'sidebar') {
        const newWidth = Math.max(180, Math.min(550, e.clientX));
        setSidebarWidth(newWidth);
      } else if (resizing === 'ai') {
        const newWidth = Math.max(180, Math.min(550, window.innerWidth - e.clientX));
        setAiInspectorWidth(newWidth);
      } else if (resizing === 'timeline') {
        const newHeight = Math.max(120, Math.min(480, window.innerHeight - e.clientY));
        setTimelineHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    if (resizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  // PROFESSIONAL LAYOUT SWITCHER
  const handleSwitchLayoutMode = (mode: 'EDITING' | 'COLOR' | 'AUDIO' | 'MOTION' | 'IA_STUDIO' | 'MULTICAM' | 'STREAMING' | 'CINEMA') => {
    setLayoutMode(mode);
    setIsFocusMode(false);
    
    if (mode === 'EDITING') {
      setSidebarState('normal');
      setSidebarActiveTab('media');
      setAiInspectorState('normal');
      setAudioMixerState('collapsed');
      setMonitorTabOverride('program');
      setDualMonitorActive(false);
      setAiInspectorTabOverride('transformacao');
    } else if (mode === 'COLOR') {
      setSidebarState('collapsed');
      setSidebarActiveTab('media');
      setAiInspectorState('normal');
      setAudioMixerState('collapsed');
      setMonitorTabOverride('grading');
      setDualMonitorActive(false);
      setAiInspectorTabOverride('cor');
    } else if (mode === 'AUDIO') {
      setSidebarState('collapsed');
      setSidebarActiveTab('media');
      setAiInspectorState('normal');
      setAudioMixerState('normal');
      setMonitorTabOverride('scopes');
      setDualMonitorActive(false);
      setAiInspectorTabOverride('audio');
    } else if (mode === 'MOTION') {
      setSidebarState('normal');
      setSidebarActiveTab('effects');
      setAiInspectorState('normal');
      setAudioMixerState('collapsed');
      setMonitorTabOverride('program');
      setDualMonitorActive(false);
      setAiInspectorTabOverride('motion');
    } else if (mode === 'IA_STUDIO') {
      setSidebarState('normal');
      setSidebarActiveTab('media');
      setAiInspectorState('normal');
      setAudioMixerState('collapsed');
      setMonitorTabOverride('program');
      setDualMonitorActive(false);
      setAiInspectorTabOverride('ai');
    } else if (mode === 'MULTICAM') {
      setSidebarState('collapsed');
      setSidebarActiveTab('media');
      setAiInspectorState('collapsed');
      setAudioMixerState('collapsed');
      setMonitorTabOverride('source');
      setDualMonitorActive(true);
      setAiInspectorTabOverride('transformacao');
    } else if (mode === 'STREAMING') {
      setSidebarState('collapsed');
      setSidebarActiveTab('media');
      setAiInspectorState('normal');
      setAudioMixerState('normal');
      setMonitorTabOverride('scopes');
      setDualMonitorActive(false);
      setAiInspectorTabOverride('audio');
    } else if (mode === 'CINEMA') {
      setSidebarState('collapsed');
      setSidebarActiveTab('media');
      setAiInspectorState('collapsed');
      setAudioMixerState('collapsed');
      setMonitorTabOverride('program');
      setDualMonitorActive(false);
      setIsFocusMode(true);
      setAiInspectorTabOverride('transformacao');
    }
  };

  // Active Project State
  const [activeProject, setActiveProject] = useState<Project>({
    id: "project-1",
    name: "Campanha Comercial VisionCut Pro",
    sequences: [
      { id: "seq-1", name: "Sequência 1 - Main Edit", createdAt: Date.now() },
      { id: "seq-2", name: "Sequência 2 - Teaser 15s", createdAt: Date.now() }
    ],
    currentSequenceId: "seq-1",
    tracks: INITIAL_TRACKS,
    clips: INITIAL_CLIPS,
    markers: INITIAL_MARKERS,
    subtitles: INITIAL_SUBTITLES,
    versions: [
      { id: "v-initial", name: "Backup Automático Inicial", timestamp: Date.now() - 3600000, description: "Criação do projeto de rascunho com faixas de drone e música acústica." }
    ],
    comments: [
      { id: "comment-1", user: "Mariana Costa (Diretora)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100", text: "Excelente início de drone, o corte com a cidade cyberpunk deve ser bem seco!", time: 18.0, timestamp: Date.now() - 1800000 }
    ],
    audioMixer: {
      masterVolume: 85,
      channels: {}
    }
  });

  // History Undos/Redos stacks
  const [historyStack, setHistoryStack] = useState<Project[]>([]);
  const [redoStack, setRedoStack] = useState<Project[]>([]);

  // Productivity Analytics Stats
  const [productivityStats, setProductivityStats] = useState<ProductivityStats>({
    editingTimeMinutes: 142,
    exportsCount: 5,
    renderedFrames: 12530,
    aiOperationsCount: 14
  });

  // Active playhead tracking states
  const [currentTime, setCurrentTime] = useState<number>(5.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [activeEditMode, setActiveEditMode] = useState<'standard' | 'ripple' | 'rolling' | 'slip'>('standard');
  const [snapEnabled, setSnapEnabled] = useState<boolean>(true);

  // Show Quick Help Shortcut Dialog
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  const playheadTimerRef = useRef<any>(null);

  // Auto-Save notification toast state
  const [autoSaveNotification, setAutoSaveNotification] = useState(false);

  // Helper: push state to Undo stack and replace active
  const commitProjectStateChange = (updated: Project) => {
    // Keep raw clone
    const currentClone = JSON.parse(JSON.stringify(activeProject));
    setHistoryStack(prev => [...prev, currentClone]);
    setRedoStack([]); // Clear redo
    setActiveProject(updated);

    // Save project in storage
    localStorage.setItem("visioncut_pro_current_project", JSON.stringify(updated));

    // Show swift save badge
    setAutoSaveNotification(true);
  };

  useEffect(() => {
    if (autoSaveNotification) {
      const t = setTimeout(() => setAutoSaveNotification(false), 2000);
      return () => clearTimeout(t);
    }
  }, [autoSaveNotification]);

  // Load from Storage on boot if exists
  useEffect(() => {
    const saved = localStorage.getItem("visioncut_pro_current_project");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.clips && parsed.tracks) {
          setActiveProject(parsed);
        }
      } catch (err) {
        console.warn("Storage check failed:", err);
      }
    }
  }, []);

  // Increase edit time increments
  useEffect(() => {
    const interval = setInterval(() => {
      setProductivityStats(prev => ({
        ...prev,
        editingTimeMinutes: prev.editingTimeMinutes + 1
      }));
    }, 60000); // 1 minute ticker
    return () => clearInterval(interval);
  }, []);

  // Handle Play/Pause timer loop frame rate emulation (30fps step)
  useEffect(() => {
    if (isPlaying) {
      playheadTimerRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t >= 60.0) {
            setIsPlaying(false);
            return 0; // Return to zero
          }
          return t + 0.1; // Increment by 100ms
        });
      }, 100);
    } else {
      if (playheadTimerRef.current) {
        clearInterval(playheadTimerRef.current);
      }
    }

    return () => {
      if (playheadTimerRef.current) clearInterval(playheadTimerRef.current);
    };
  }, [isPlaying]);

  // Hotkey keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape overlays
      if (e.key === "Escape") {
        setShowShortcutHelp(false);
        setShowCommentsDrawer(false);
        return;
      }

      // Spacebar toggler (Ignore if user is typing inside textareas or inputs)
      if (e.key === " " && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsPlaying(p => !p);
      }

      // Tab key - Toggle FOCUS MODE
      if (e.key === "Tab" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsFocusMode(prev => !prev);
      }

      // 'S' - Splitselected clip
      if (e.key.toLowerCase() === "s" && selectedClipId && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        handleSplitClip(selectedClipId, currentTime);
      }

      // Delete clipe
      if (e.key === "Delete" && selectedClipId && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        handleDeleteClip(selectedClipId);
      }

      // 'N' - Toggle snap snapping
      if (e.key.toLowerCase() === "n" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setSnapEnabled(prev => !prev);
      }

      // 'M' - Add Marker point
      if (e.key.toLowerCase() === "m" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        handleCreateMarker(currentTime, "Marcador Manual");
      }

      // Undo Ctrl+Z
      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleTriggerUndo();
      }

      // Redo Ctrl+Y
      if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleTriggerRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedClipId, currentTime, activeProject]);

  // Command handlers
  const handleTriggerUndo = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(activeProject))]);
    setHistoryStack(prev => prev.slice(0, prev.length - 1));
    setActiveProject(previous);
  };

  const handleTriggerRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistoryStack(prev => [...prev, JSON.parse(JSON.stringify(activeProject))]);
    setRedoStack(prev => prev.slice(0, prev.length - 1));
    setActiveProject(next);
  };

  // Switch sequence selection
  const handleSwitchSequence = (seqId: string) => {
    const updated = { ...activeProject, currentSequenceId: seqId };
    commitProjectStateChange(updated);
  };

  // Add Asset from Media Pool to active tracks
  const handleAddAssetToTimeline = (asset: Asset) => {
    // Map track target based on type
    let targetTrack = "track-v1";
    if (asset.type === 'audio') targetTrack = "track-a1";
    else if (asset.type === 'image') targetTrack = "track-v2";

    const newClip: Clip = {
      id: `clip-${asset.id}-${Date.now()}`,
      name: asset.name,
      type: asset.type,
      url: asset.url,
      thumbnail: asset.url,
      start: currentTime, // Place exactly at the current scrubber needle
      duration: asset.duration > 15 ? 15 : asset.duration, // Max length 15s to keep inside canvas
      sourceStart: 0,
      sourceDuration: asset.duration,
      trackId: targetTrack,
      color: asset.type === 'video' ? '#0d9488' : asset.type === 'audio' ? '#2563eb' : '#db2777', // colors (teal, blue, pink)
      speed: 1.0,
      
      // Default configurations
      filters: { brightness: 100, contrast: 100, saturate: 100, blur: 0, hueRotate: 0, grayscale: 0, sepia: 0, invert: 0 },
      colorGrading: { temp: 0, tint: 0, exposure: 0, shadows: 0, highlights: 0, lutId: "none" },
      motion: { scale: 100, positionX: 0, positionY: 0, opacity: 100, rotation: 0 },
      audioSettings: {
        volume: 90,
        pan: 0,
        equalizer: { low: 0, mid: 0, high: 0 },
        compressor: false,
        noiseReduction: false,
        noiseLevel: 10,
        normalize: false
      }
    };

    const updatedClips = [...activeProject.clips, newClip];
    const updatedProject = { ...activeProject, clips: updatedClips };
    commitProjectStateChange(updatedProject);
    setSelectedClipId(newClip.id);
  };

  // Split selected clip at the active Playhead point (S)
  const handleSplitClip = (clipId: string, time: number) => {
    const targetClip = activeProject.clips.find(c => c.id === clipId);
    if (!targetClip) return;

    // Check if playhead actually lies within clip duration span
    if (time <= targetClip.start || time >= (targetClip.start + targetClip.duration)) {
      alert("⚠️ A agulha de reprodução deve estar DENTRO do clipe selecionado para dividi-lo!");
      return;
    }

    const firstPieceDuration = time - targetClip.start;
    const secondPieceDuration = targetClip.duration - firstPieceDuration;

    // First clip segment clone
    const clipPartA: Clip = {
      ...JSON.parse(JSON.stringify(targetClip)),
      id: `${targetClip.id}-ptA`,
      duration: firstPieceDuration,
    };

    // Second clip segment clone
    const clipPartB: Clip = {
      ...JSON.parse(JSON.stringify(targetClip)),
      id: `${targetClip.id}-ptB`,
      start: time,
      duration: secondPieceDuration,
      sourceStart: targetClip.sourceStart + firstPieceDuration // Adjust internal clip offset for Slip logic
    };

    // Filter out original and inject chunks
    const updatedClips = activeProject.clips.filter(c => c.id !== clipId).concat([clipPartA, clipPartB]);
    const updatedProject = { ...activeProject, clips: updatedClips };

    commitProjectStateChange(updatedProject);
    setSelectedClipId(clipPartB.id); // Autofocus newly carved clip segment
  };

  // Join adjacent clips (Non-destructive merger simulation)
  const handleMergeAdjacentClips = () => {
    if (activeProject.clips.length < 2) return;
    
    // Sort clips chronologically by start
    const sorted = [...activeProject.clips].sort((a, b) => a.start - b.start);
    const mergedList: Clip[] = [];
    let mergedCount = 0;

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const last = mergedList[mergedList.length - 1];

      // Check if they are on same track, adjacently touch, and are of identical file source
      if (last && last.trackId === current.trackId && last.type === current.type && Math.abs((last.start + last.duration) - current.start) < 0.25) {
        // Merge length
        last.duration += current.duration;
        mergedCount++;
      } else {
        mergedList.push(JSON.parse(JSON.stringify(current)));
      }
    }

    if (mergedCount === 0) {
      alert("⚠️ Nenhum clipe adjacente compatível (mesmo tipo e pistas encostadas) foi encontrado para mesclagem.");
      return;
    }

    const updated = { ...activeProject, clips: mergedList };
    commitProjectStateChange(updated);
    alert(`💡 Junção de clipes concluída! ${mergedCount} segmentos adjacentes mesclados.`);
  };

  // Delete clip from track
  const handleDeleteClip = (clipId: string) => {
    const filtered = activeProject.clips.filter(c => c.id !== clipId);
    const updated = { ...activeProject, clips: filtered };
    setSelectedClipId(null);
    commitProjectStateChange(updated);
  };

  // Add customized Marker points
  const handleCreateMarker = (time: number, label: string) => {
    const newMarker: Marker = {
      id: `mk-${Date.now()}`,
      time: parseFloat(time.toFixed(1)),
      color: "#ef4444", // standard marker point
      label: label
    };
    const updatedMarkers = [...activeProject.markers, newMarker];
    const updated = { ...activeProject, markers: updatedMarkers };
    commitProjectStateChange(updated);
  };

  // Sidebar controls setters
  const handleUpdateFilters = (clipId: string, filters: Partial<VideoFilters>) => {
    const updated = activeProject.clips.map(c => {
      if (c.id === clipId) {
        return { ...c, filters: { ...c.filters!, ...filters } };
      }
      return c;
    });
    setActiveProject(prev => ({ ...prev, clips: updated }));
  };

  const handleUpdateColorGrading = (clipId: string, grading: Partial<ColorGrading>) => {
    const updated = activeProject.clips.map(c => {
      if (c.id === clipId) {
        return { ...c, colorGrading: { ...c.colorGrading!, ...grading } };
      }
      return c;
    });
    setActiveProject(prev => ({ ...prev, clips: updated }));
  };

  const handleUpdateMotion = (clipId: string, motion: Partial<MotionParams>) => {
    const updated = activeProject.clips.map(c => {
      if (c.id === clipId) {
        return { ...c, motion: { ...c.motion!, ...motion } };
      }
      return c;
    });
    setActiveProject(prev => ({ ...prev, clips: updated }));
  };

  const handleUpdateAudioSettings = (clipId: string, audio: Partial<AudioSettings>) => {
    const updated = activeProject.clips.map(c => {
      if (c.id === clipId) {
        return { ...c, audioSettings: { ...c.audioSettings!, ...audio } };
      }
      return c;
    });
    setActiveProject(prev => ({ ...prev, clips: updated }));
  };

  // Title cards updater
  const handleUpdateClipText = (clipId: string, text: string) => {
    // Check if we are creating brand-new text template clip
    if (clipId === "add-new-text-lower" || clipId === "add-new-text-cyber") {
      const templateName = clipId === "add-new-text-lower" ? "[LowerThird] Legenda" : "[Neon] Título Cyber";
      const templateStyle = clipId === "add-new-text-lower" 
        ? { fontSize: 18, textColor: "#ffffff", backgroundColor: "#000000bb", fontFamily: "sans", align: "center" as const }
        : { fontSize: 32, textColor: "#00ffff", backgroundColor: "transparent", fontFamily: "display", align: "center" as const };

      const newClip: Clip = {
        id: `text-clip-${Date.now()}`,
        name: templateName,
        type: "text",
        url: "",
        start: currentTime,
        duration: 5,
        sourceStart: 0,
        sourceDuration: 5,
        trackId: "track-t1",
        color: "#d97706",
        speed: 1.0,
        textContent: text || "Sua Legenda de Texto Aqui",
        textStyle: templateStyle
      };

      const updated = { ...activeProject, clips: [...activeProject.clips, newClip] };
      commitProjectStateChange(updated);
      setSelectedClipId(newClip.id);
      return;
    }

    // Otherwise standard edit existing clip text
    const updated = activeProject.clips.map(c => {
      if (c.id === clipId) {
        return { ...c, textContent: text };
      }
      return c;
    });
    setActiveProject(prev => ({ ...prev, clips: updated }));
  };

  // Master and channels volume knobs triggers for AudioMixer component
  const handleUpdateTrackVolume = (trackId: string, volume: number) => {
    const updatedTracks = activeProject.tracks.map(t => {
      if (t.id === trackId) {
        return { ...t, volume, muted: volume === 0 };
      }
      return t;
    });
    setActiveProject(prev => ({ ...prev, tracks: updatedTracks }));
  };

  const handleUpdateMasterVolume = (volume: number) => {
    setActiveProject(prev => ({
      ...prev,
      audioMixer: { ...prev.audioMixer, masterVolume: volume }
    }));
  };

  // Quick preset templates block
  const handleApplyPresetTemplate = (templateId: string) => {
    if (templateId === "tp-cinematicintro") {
      // Crop all tracks to form letterbox black cinematic format
      const updatedClips = activeProject.clips.map(c => {
        if (c.id === selectedClipId && c.filters) {
          return {
            ...c,
            filters: { ...c.filters, brightness: 90, contrast: 110, saturate: 90 },
            colorGrading: { ...c.colorGrading!, lutId: "lut-cinema" }
          };
        }
        return c;
      });
      commitProjectStateChange({ ...activeProject, clips: updatedClips });
      alert("🎬 Preset 'Cinematic Letterbox Film' aplicado ao clipe ativo.");
    } else if (templateId === "tp-ytshorts") {
      // Vertical aspect crop
      alert("📱 Proporção para YouTube Shorts (9:16) pré-definida. Utilize a aba Monitor de Programa para ver as margens de corte.");
    } else {
      alert("✨ Template de timeline acoplado ao seu fluxo com sucesso.");
    }
  };

  // --- AI MODULE EVENTS ---
  const handleUpdateSubtitles = (subs: Subtitle[]) => {
    commitProjectStateChange({
      ...activeProject,
      subtitles: subs
    });

    // Create marker
    if (subs.length > 0) {
      handleCreateMarker(subs[0].startTime, "Legenda Transcrita");
      setProductivityStats(p => ({ ...p, aiOperationsCount: p.aiOperationsCount + 1 }));
    }
  };

  const handleUpdateSubtitlesTranslations = (translations: Array<{ id: string, translatedText: string }>) => {
    const updatedSubs = activeProject.subtitles.map(sub => {
      const match = translations.find(t => t.id === sub.id);
      if (match) {
        return { ...sub, translatedText: match.translatedText };
      }
      return sub;
    });

    commitProjectStateChange({
      ...activeProject,
      subtitles: updatedSubs
    });

    setProductivityStats(p => ({ ...p, aiOperationsCount: p.aiOperationsCount + 1 }));
  };

  const handleApplySocialCuts = (cuts: Array<{ title: string, start: number, end: number }>) => {
    // Generate Markers
    let updatedMarkers = [...activeProject.markers];
    cuts.forEach((cut, idx) => {
      updatedMarkers.push({
        id: `mk-cut-${Date.now()}-${idx}`,
        time: cut.start,
        color: "#fbbf24", // yellow color for cuts
        label: `CORTADO: ${cut.title}`,
        chapter: true
      });
    });

    commitProjectStateChange({
      ...activeProject,
      markers: updatedMarkers
    });

    setProductivityStats(p => ({ ...p, aiOperationsCount: p.aiOperationsCount + 1 }));
  };

  const handleApplySilenceCuts = (silences: Array<{ startSec: number, endSec: number }>) => {
    if (silences.length === 0) return;

    // Place split and markers on those silences
    const firstSilence = silences[0];
    handleCreateMarker(firstSilence.startSec, "Silêncio Removido");

    // Cut clip
    const targetClip = activeProject.clips.find(c => c.type === 'video');
    if (targetClip && firstSilence.startSec > targetClip.start && firstSilence.startSec < (targetClip.start + targetClip.duration)) {
      handleSplitClip(targetClip.id, firstSilence.startSec);
    }

    setProductivityStats(p => ({ ...p, aiOperationsCount: p.aiOperationsCount + 1 }));
  };

  const handleApplyBackgroundRemoval = (clipId: string, enabled: boolean) => {
    const updatedClips = activeProject.clips.map(c => {
      if (c.id === clipId) {
        return { ...c, aiBackgroundRemoval: enabled };
      }
      return c;
    });

    commitProjectStateChange({
      ...activeProject,
      clips: updatedClips
    });

    setProductivityStats(p => ({ ...p, aiOperationsCount: p.aiOperationsCount + 1 }));
  };

  const handleAutoOrganizeMedia = () => {
    // Group and change colors based on track layout type
    const updatedClips = activeProject.clips.map(c => {
      if (c.trackId === "track-v1") return { ...c, color: "#0d9488" }; // teal
      if (c.trackId === "track-v2") return { ...c, color: "#10b981" }; // emerald
      if (c.trackId === "track-t1") return { ...c, color: "#d97706" }; // amber
      return { ...c, color: "#2563eb" }; // blue
    });

    commitProjectStateChange({
      ...activeProject,
      clips: updatedClips
    });

    alert("📂 IA organizou e coloriu suas faixas com sucesso por estrutura de categoria.");
    setProductivityStats(p => ({ ...p, aiOperationsCount: p.aiOperationsCount + 1 }));
  };

  const handleApplyUpscaling = (clipId: string) => {
    const updatedClips = activeProject.clips.map(c => {
      if (c.id === clipId && c.motion) {
        return {
          ...c,
          motion: { ...c.motion, scale: 110 },
          // simulated sharpening
          filters: { ...c.filters!, contrast: 115, saturate: 105 }
        };
      }
      return c;
    });

    commitProjectStateChange({
      ...activeProject,
      clips: updatedClips
    });

    alert("💎 Filtro de Upscaling AI 4K/8K com super-nitidez ativado!");
    setProductivityStats(p => ({ ...p, aiOperationsCount: p.aiOperationsCount + 1, renderedFrames: p.renderedFrames + 1000 }));
  };

  // Restore previous back-up versions
  const handleRestoreVersion = (ver: Version) => {
    // Create new backup point of current before restoring
    const currentBackup: Version = {
      id: `backup-rested-${Date.now()}`,
      name: `Snapshot Pré-Restauração (${ver.name})`,
      timestamp: Date.now(),
      description: "Ponto de salvamento gerado antes de reverter a versão."
    };

    const rolledVersionProject = {
      ...activeProject,
      versions: [...activeProject.versions, currentBackup]
    };

    setActiveProject(prev => {
      const rest = {
        ...prev,
        tracks: INITIAL_TRACKS,
        clips: INITIAL_CLIPS,
        markers: INITIAL_MARKERS,
        subtitles: INITIAL_SUBTITLES,
        versions: [...prev.versions, currentBackup]
      };
      // save
      localStorage.setItem("visioncut_pro_current_project", JSON.stringify(rest));
      return rest;
    });

    alert(`🕒 Versão '${ver.name}' restaurada com êxito!`);
  };

  // Submit new comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const comm: CollaborationComment = {
      id: `comm-new-${Date.now()}`,
      user: "João Silva (Você)",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100", // male handsome face
      text: newCommentText,
      time: currentTime,
      timestamp: Date.now()
    };

    const updated = {
      ...activeProject,
      comments: [comm, ...activeProject.comments]
    };

    commitProjectStateChange(updated);
    setNewCommentText("");
  };

  // Get active subtitle text for playhead needle time
  const getActiveSubtitleAtTime = () => {
    return activeProject.subtitles.find(sub => {
      return currentTime >= sub.startTime && currentTime <= sub.endTime;
    }) || null;
  };

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden select-none ${themeMode === 'light' ? 'bg-white text-neutral-900' : 'bg-neutral-950 text-neutral-100'}`}>
      
      {/* 1. APP MAIN HEADER (Max-Height 40px) */}
      <header className="h-10 bg-neutral-950 border-b border-neutral-920 flex items-center justify-between px-3 shrink-0 select-none text-xs z-25 relative">
        
        {/* Left: Logo and Menu list */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setWorkspaceMode('dashboard')}>
            <div className="w-5 h-5 bg-gradient-to-tr from-teal-400 to-indigo-600 rounded flex items-center justify-center font-black text-[10px] text-white">
              V
            </div>
            <span className="font-black text-[12px] tracking-tight text-white font-display">
              VisionCut Pro
            </span>
          </div>

          <span className="w-px h-3.5 bg-neutral-800 mx-1"></span>

          {/* Menus horizontais */}
          <nav className="hidden xl:flex items-center gap-3.5 text-neutral-400 font-semibold text-[11px] select-none">
            <button className="hover:text-white transition" onClick={() => alert("Menu Arquivo: Novo, Abrir, Salvar, Compactar ou Importar elemento.")}>Arquivo</button>
            <button className="hover:text-white transition" onClick={() => alert("Menu Editar: Desfazer, Refazer, Copiar, Colar ou Dividir clipe.")}>Editar</button>
            <button className="hover:text-white transition" onClick={() => alert("Menu Clipe: Modificar velocidade, Corrigir áudio, Vincular canais.")}>Clipe</button>
            <button className="hover:text-white transition" onClick={() => alert("Menu Sequência: Criar sequência, Sincronizar trilha, Limpar marcadores.")}>Sequência</button>
            <button className="hover:text-white transition" onClick={() => setActiveEditMode('standard')}>Marcadores</button>
            <button className="hover:text-white transition" onClick={() => alert("Menu Gráficos: Inserir Lower-third, Letreiro Neon, Logo flutuante.")}>Gráficos e Títulos</button>
            <button className="hover:text-white transition" onClick={() => setIsFocusMode(!isFocusMode)}>Exibir</button>
            <button className="hover:text-white transition" onClick={() => setAiInspectorState('normal')}>Janela</button>
            <button className="hover:text-white transition" onClick={() => setShowShortcutHelp(true)}>Ajuda</button>
          </nav>
        </div>

        {/* Center: project name & auto save indicator */}
        <div className="hidden md:flex items-center gap-2.5 max-w-sm">
          <span className="font-bold text-white text-[11.5px] truncate max-w-44" title={activeProject.name}>
            {activeProject.name}
          </span>
          <span className="text-[8.5px] font-mono bg-neutral-900 border border-neutral-850 px-1.5 py-0.2 rounded text-teal-400 animate-pulse flex items-center gap-1 leading-none shrink-0 select-none">
            <span className="w-1 h-1 bg-teal-400 rounded-full"></span>
            Salvo na nuvem
          </span>
        </div>

        {/* Right Buttons: Importar, Exportar, Compartilhar, Notificações, Perfil */}
        <div className="flex items-center gap-1.5">
          {/* Workspace mode quick toggler */}
          <button
            onClick={() => setWorkspaceMode(workspaceMode === 'editor' ? 'dashboard' : 'editor')}
            className="px-2 py-1 bg-neutral-900 border border-neutral-800 text-[9.5px] font-mono text-neutral-400 hover:text-white hover:border-neutral-700 rounded transition"
            title="Alternar entre Monitoramento e Painel"
          >
            {workspaceMode === 'editor' ? "PAINEL" : "WORKSPACE"}
          </button>

          <span className="w-px h-3 bg-neutral-800 mx-1"></span>

          <button 
            type="button" 
            onClick={() => { setSidebarState('normal'); setSidebarActiveTab('media'); }}
            className="px-2 py-1 bg-neutral-900 border border-neutral-850 text-[10px] font-bold text-teal-400 hover:bg-neutral-850 rounded transition cursor-pointer"
          >
            Importar
          </button>

          <button 
            type="button" 
            onClick={() => { setAiInspectorState('normal'); setMonitorTabOverride('program'); }}
            className="px-2 py-1 bg-teal-500 hover:bg-teal-400 text-[10px] font-bold text-neutral-950 rounded transition cursor-pointer"
          >
            Exportar
          </button>

          <button 
            type="button" 
            onClick={() => { setShowCommentsDrawer(true); }}
            className="px-2 py-1 bg-neutral-900 border border-neutral-800 text-[10px] font-semibold text-neutral-300 hover:text-white rounded transition"
          >
            Compartilhar
          </button>

          {/* Comment notification dot */}
          <button
            onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}
            className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 rounded-lg relative"
            title="Mostrar comentários da equipe"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {activeProject.comments.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
            )}
          </button>

          <button
            onClick={() => alert(`💪 Estatísticas do Usuário:\n\n- Renderizadas: ${productivityStats.renderedFrames} frames\n- Operações de IA: ${productivityStats.aiOperationsCount}\n- Tempo logado: ${productivityStats.editingTimeMinutes} minutos\n- Licença VisionCut Pro ativa.`)}
            className="w-5.5 h-5.5 rounded-full bg-neutral-800 flex items-center justify-center font-mono font-bold text-[9px] text-teal-400 cursor-pointer"
            title="Visualizar Perfil e Rendimento"
          >
            VC
          </button>
        </div>
      </header>

      {workspaceMode === 'editor' && (
        <div className="h-7 bg-neutral-900 border-b border-neutral-950 flex items-center justify-between px-3 select-none text-[10px] shrink-0 z-20">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mr-2 font-mono shrink-0">Workspaces:</span>
            {[
              { id: 'EDITING', label: 'Edição', icon: '🎬' },
              { id: 'COLOR', label: 'Color DaVinci', icon: '🎨' },
              { id: 'AUDIO', label: 'Áudio (Mixer)', icon: '🎚️' },
              { id: 'MOTION', label: 'Motion Graphics', icon: '✨' },
              { id: 'IA_STUDIO', label: 'IA Studio', icon: '🧙‍♂️' },
              { id: 'MULTICAM', label: 'Multicam (Dual)', icon: '🎞️' },
              { id: 'STREAMING', label: 'Streaming', icon: '📡' },
              { id: 'CINEMA', label: 'Cinema (Preto)', icon: '🍿' }
            ].map(ws => (
              <button
                key={ws.id}
                onClick={() => handleSwitchLayoutMode(ws.id as any)}
                className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5 transition shrink-0 ${layoutMode === ws.id ? 'bg-neutral-800 text-teal-400 border border-teal-500/15' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                <span>{ws.icon}</span>
                <span>{ws.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                setSidebarState('normal');
                setAiInspectorState('normal');
                setAudioMixerState('collapsed');
                setDualMonitorActive(false);
                setIsFocusMode(false);
                setLayoutMode('EDITING');
                setAiInspectorTabOverride('transformacao');
                setMonitorTabOverride('program');
              }}
              className="px-2 py-0.5 bg-neutral-950 hover:bg-neutral-850 hover:text-teal-400 text-neutral-500 border border-neutral-850 rounded text-[9px] font-mono font-bold transition"
              title="Resetar painéis para layout padrão de fábrica"
            >
              🔄 RESET DE FÁBRICA
            </button>
          </div>
        </div>
      )}

      {/* 2. CORE WORKSPACE */}
      <main className="flex-1 min-h-0 relative">
        {workspaceMode === 'dashboard' ? (
          <Dashboard
            project={activeProject}
            stats={productivityStats}
            onSelectProject={(projId) => {
              if (projId === "custom-project-vlog") {
                commitProjectStateChange({
                  ...activeProject,
                  name: "Vlog Pessoal de Tecnologia #8",
                  clips: INITIAL_CLIPS.slice(0, 3)
                });
              } else if (projId === "custom-project-cuts") {
                commitProjectStateChange({
                  ...activeProject,
                  name: "Cortes TikTok - Podcast Piloto",
                  clips: INITIAL_CLIPS.slice(1, 2)
                });
              }
              setWorkspaceMode('editor');
            }}
            onAddNewProject={(name) => {
              commitProjectStateChange({
                ...activeProject,
                name: name,
                clips: [],
                markers: [],
                subtitles: []
              });
              setWorkspaceMode('editor');
            }}
            onRestoreVersion={handleRestoreVersion}
            onClose={() => setWorkspaceMode('editor')}
          />
        ) : (
          /* EDITOR LAYOUT WITH COLLAPSIBLE PANELS AND RESIZABLE DIVIDERS */
          <div className="flex flex-col h-full overflow-hidden select-none">
            
            {/* Upper Workstation Row (Sidebar Bin, Main Program Monitor, AI inspector) */}
            <div className="flex-1 min-h-0 flex overflow-hidden">
              
              {/* LEFT SIDEBAR SECTION */}
              {sidebarState === 'normal' && !isFocusMode ? (
                <div 
                  style={{ width: 220 }} // Reduced to exactly 220px as requested by user
                  className="shrink-0 flex flex-col h-full bg-neutral-950 border-r border-neutral-900 relative group"
                >
                  <div className="h-7 px-2.5 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between leading-none font-mono text-[8.5px] font-black uppercase text-neutral-400 tracking-wider">
                    <span>📚 Bin</span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setSidebarState('detached')} className="p-0.5 hover:text-teal-400 transition" title="Desacoplar"><ExternalLink className="w-3 h-3" /></button>
                      <button 
                        onClick={() => setSidebarState('collapsed')} 
                        className="px-1 py-0.5 text-[9px] font-mono hover:text-teal-400 bg-neutral-900 border border-neutral-800 rounded hover:border-teal-500/20 text-neutral-400 font-bold transition select-none leading-none flex items-center justify-center" 
                        title="Recolher"
                      >
                        &lt;&lt;
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 overflow-auto">
                    <Sidebar
                      project={activeProject}
                      selectedClipId={selectedClipId}
                      onAddAssetToTimeline={handleAddAssetToTimeline}
                      onUpdateFilters={handleUpdateFilters}
                      onUpdateColorGrading={handleUpdateColorGrading}
                      onUpdateMotion={handleUpdateMotion}
                      onUpdateAudioSettings={handleUpdateAudioSettings}
                      onUpdateClipText={handleUpdateClipText}
                      onApplyPresetTemplate={handleApplyPresetTemplate}
                      onDeleteClip={handleDeleteClip}
                      activeTabOverride={sidebarActiveTab}
                    />
                  </div>
                </div>
              ) : (sidebarState === 'collapsed' || isFocusMode) && sidebarState !== 'detached' && sidebarState !== 'fullscreen' && (
                /* Collapsed compact side bar shortcut sidebar */
                <div className="w-11 bg-neutral-950 border-r border-neutral-900 h-full flex flex-col items-center py-4 gap-4 shrink-0 justify-between select-none">
                  <div className="flex flex-col items-center gap-3">
                    <button 
                      onClick={() => { setSidebarState('normal'); setSidebarActiveTab('media'); }} 
                      className="p-2.5 text-neutral-400 hover:text-teal-400 hover:bg-neutral-900 rounded-lg transition"
                      title="Mídia / Arquivos"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { setSidebarState('normal'); setSidebarActiveTab('effects'); }}
                      className="p-2.5 text-neutral-400 hover:text-teal-400 hover:bg-neutral-900 rounded-lg transition"
                      title="Efeitos / Filtros"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { setSidebarState('normal'); setSidebarActiveTab('text'); }}
                      className="p-2.5 text-neutral-400 hover:text-teal-400 hover:bg-neutral-900 rounded-lg transition"
                      title="Legendas"
                    >
                      <Type className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => setSidebarState('normal')}
                    className="p-1 px-1.5 text-teal-400 hover:text-teal-300 bg-teal-500/10 border border-teal-500/25 rounded-md transition"
                    title="Maximizar biblioteca"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* CENTER COLUMN: DOMINANT VIDEO MONITOR PREVIEW (Maximized to take all layout space) */}
              {sidebarState !== 'fullscreen' && aiInspectorState !== 'fullscreen' ? (
                <div className="flex-1 min-w-0 flex flex-col h-full bg-neutral-900">
                  <Monitor
                    project={activeProject}
                    currentTime={currentTime}
                    onSetCurrentTime={setCurrentTime}
                    isPlaying={isPlaying}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    onExport={(platform, res, isGpu) => {
                      setProductivityStats(prev => ({
                        ...prev,
                        exportsCount: prev.exportsCount + 1,
                        renderedFrames: prev.renderedFrames + (res === '4K' ? 3000 : 1800)
                      }));
                      alert(`🎉 Renderização Concluída! Arquivo final gerado no perfil ${platform.toUpperCase()} (${res}) acelerado por GPU.`);
                    }}
                    selectedClip={activeProject.clips.find(c => c.id === selectedClipId) || null}
                    activeSubtitle={getActiveSubtitleAtTime()}
                    activeTabOverride={monitorTabOverride}
                    forcedDualMonitor={dualMonitorActive}
                  />
                </div>
              ) : (
                /* Fullscreen panel close bar */
                <div className="flex-1 bg-neutral-950 p-6 flex flex-col justify-between text-left">
                  <div className="bg-neutral-900 p-4 border border-neutral-850 rounded-xl max-w-lg mx-auto w-full space-y-4">
                    <span className="text-xs uppercase font-mono tracking-widest text-teal-400 font-bold block">
                      📌 Painel em Modo Tela Cheia
                    </span>
                    <p className="text-xs text-neutral-450 leading-relaxed">
                      Este painel secundário está atualmente ocupando a área de trabalho para foco total de edição. Clique abaixo para reacoplar.
                    </p>
                    <button 
                      onClick={() => {
                        setSidebarState('normal');
                        setAiInspectorState('collapsed');
                      }}
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-neutral-950 text-xs font-bold rounded shadow transition"
                    >
                      Restaurar Layout de Trabalho
                    </button>
                  </div>
                </div>
              )}

              {/* RIGHT AI INSPECTOR SECTION */}
              {aiInspectorState === 'normal' && !isFocusMode ? (
                <div 
                  style={{ width: 280 }} // Fixed standard width of 280px as requested by user
                  className="shrink-0 flex flex-col h-full bg-neutral-900 border-l border-neutral-900 relative group"
                >
                  <div className="h-7 px-2.5 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between leading-none font-mono text-[8.5px] font-black uppercase text-neutral-400 tracking-wider">
                    <span>🧙‍♂️ Inspetor de Efeitos</span>
                    <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setAiInspectorState('detached')} className="p-0.5 hover:text-teal-400 transition" title="Desacoplar"><ExternalLink className="w-3 h-3" /></button>
                      <button onClick={() => setAiInspectorState('collapsed')} className="p-0.2 hover:text-teal-400 transition" title="Recolher"><ChevronRight className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 overflow-auto bg-neutral-900">
                    <AIInspector
                      project={activeProject}
                      onUpdateSubtitles={handleUpdateSubtitles}
                      onUpdateSubtitlesTranslations={handleUpdateSubtitlesTranslations}
                      onApplySocialCuts={handleApplySocialCuts}
                      onApplySilenceCuts={handleApplySilenceCuts}
                      onApplyBackgroundRemoval={handleApplyBackgroundRemoval}
                      onAutoOrganizeMedia={handleAutoOrganizeMedia}
                      onApplyUpscaling={handleApplyUpscaling}
                      selectedClip={activeProject.clips.find(c => c.id === selectedClipId) || null}
                      onUpdateFilters={handleUpdateFilters}
                      onUpdateColorGrading={handleUpdateColorGrading}
                      onUpdateMotion={handleUpdateMotion}
                      onUpdateAudioSettings={handleUpdateAudioSettings}
                      activeTabOverride={aiInspectorTabOverride}
                    />
                  </div>
                </div>
              ) : (aiInspectorState === 'collapsed' || isFocusMode) && aiInspectorState !== 'detached' && aiInspectorState !== 'fullscreen' && (
                /* Collapsed vertical sidebar shortcut rail right */
                <div className="w-11 bg-neutral-950 border-l border-neutral-900 h-full flex flex-col items-center py-4 gap-4 shrink-0 justify-between select-none p-1">
                  <div className="flex flex-col items-center gap-3">
                    <button 
                      onClick={() => setAiInspectorState('normal')} 
                      className="p-2.5 text-neutral-400 hover:text-teal-400 hover:bg-neutral-900 rounded-lg transition"
                      title="Inspetor Rápido"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </button>
                  </div>
                  <button 
                    onClick={() => setAiInspectorState('normal')}
                    className="p-1 px-1.5 text-teal-400 hover:text-teal-300 bg-teal-500/10 border border-teal-500/25 rounded-md transition"
                    title="Maximizar Inspetor"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>

            {/* Draggable Divider for TIMELINE SECTION */}
            <div 
              onMouseDown={() => setResizing('timeline')}
              className="h-1 bg-neutral-950 hover:bg-teal-500/40 cursor-row-resize transition relative z-30 flex items-center justify-center group"
            >
              <div className="w-16 h-1 bg-neutral-800 group-hover:bg-teal-400 rounded transition" />
            </div>

            {/* Bottom Workstation Column (Timeline Multipista and Audio Mixer side-by-side) */}
            <div 
              style={{ height: timelineHeight }}
              className="shrink-0 flex min-h-[140px] bg-neutral-950/20 border-t border-neutral-900 overflow-hidden"
            >
              {/* Timeline (Width approx. 70-80%) */}
              <div className="flex-1 min-w-0 h-full overflow-auto border-r border-neutral-900">
                <Timeline
                  tracks={activeProject.tracks}
                  clips={activeProject.clips}
                  markers={activeProject.markers}
                  subtitles={activeProject.subtitles}
                  currentTime={currentTime}
                  onSetCurrentTime={setCurrentTime}
                  selectedClipId={selectedClipId}
                  onSelectClip={setSelectedClipId}
                  onSplitClip={handleSplitClip}
                  onMergeClips={handleMergeAdjacentClips}
                  onDeleteClip={handleDeleteClip}
                  onAddMarker={handleCreateMarker}
                  snapEnabled={snapEnabled}
                  onToggleSnap={() => setSnapEnabled(!snapEnabled)}
                  editMode={activeEditMode}
                  onChangeEditMode={setActiveEditMode}
                  onUpdateClipPosition={(clipId, start) => {
                    const updated = activeProject.clips.map(c => {
                      if (c.id === clipId) return { ...c, start };
                      return c;
                    });
                    commitProjectStateChange({ ...activeProject, clips: updated });
                  }}
                />
              </div>

              {/* Collapsed/Normal Audio Mixer (Width approx. 20-30%) */}
              {audioMixerState === 'normal' && !isFocusMode ? (
                <div className="w-[280px] shrink-0 h-full bg-neutral-950 flex flex-col border-l border-neutral-900 select-none">
                  <div className="h-6 px-2.5 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between leading-none font-mono text-[8.5px] font-black uppercase text-neutral-400 tracking-wider">
                    <span>🎛️ Mixer Sinal</span>
                    <button onClick={() => setAudioMixerState('collapsed')} className="p-0.5 hover:text-teal-400 transition" title="Recolher"><X className="w-3 h-3" /></button>
                  </div>
                  <div className="flex-1 min-h-0 bg-neutral-950">
                    <AudioMixer
                      project={activeProject}
                      tracks={activeProject.tracks}
                      onUpdateTrackVolume={handleUpdateTrackVolume}
                      onUpdateMasterVolume={handleUpdateMasterVolume}
                      isPlaying={isPlaying}
                    />
                  </div>
                </div>
              ) : (audioMixerState === 'collapsed' || isFocusMode) && audioMixerState !== 'detached' && (
                <div className="w-11 bg-neutral-950 hover:bg-neutral-900/60 transition shrink-0 h-full border-l border-neutral-900 flex flex-col items-center justify-center cursor-pointer" onClick={() => setAudioMixerState('normal')} title="Abrir Mixer de Som">
                  <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-[7.5px] font-bold text-neutral-500 uppercase tracking-widest mt-2 writing-mode-vertical-rl">MIXER</span>
                </div>
              )}

            </div>

            {/* DETACHED PANEL 1: SIDEBAR */}
            {sidebarState === 'detached' && (
              <div 
                style={{ left: panelPositions.sidebar.x, top: panelPositions.sidebar.y }}
                className="fixed w-[320px] h-[480px] bg-neutral-900 shadow-2xl border border-teal-500/30 rounded-xl z-40 flex flex-col pointer-events-auto backdrop-blur-md overflow-hidden animate-fade-in text-left"
              >
                <div 
                  onMouseDown={(e) => startDraggingPanel(e, 'sidebar')}
                  className="bg-neutral-950 p-2 text-[10px] font-mono select-none font-bold text-teal-400 border-b border-neutral-850 flex items-center justify-between cursor-move"
                >
                  <span className="flex items-center gap-1.5 uppercase">⚡ Biblioteca de Mídia (Flutuante)</span>
                  <div className="flex gap-1.5 bg-neutral-900 border border-neutral-800 p-0.5 rounded">
                    <button onClick={() => setSidebarState('normal')} className="px-1 hover:text-white pb-0.5" title="Reacoplar">
                      <Layout className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setSidebarState('collapsed')} className="px-1 hover:text-white" title="Fechar">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto bg-neutral-900">
                  <Sidebar
                    project={activeProject}
                    selectedClipId={selectedClipId}
                    onAddAssetToTimeline={handleAddAssetToTimeline}
                    onUpdateFilters={handleUpdateFilters}
                    onUpdateColorGrading={handleUpdateColorGrading}
                    onUpdateMotion={handleUpdateMotion}
                    onUpdateAudioSettings={handleUpdateAudioSettings}
                    onUpdateClipText={handleUpdateClipText}
                    onApplyPresetTemplate={handleApplyPresetTemplate}
                    onDeleteClip={handleDeleteClip}
                    activeTabOverride={sidebarActiveTab}
                  />
                </div>
              </div>
            )}

            {/* DETACHED PANEL 2: AISTUDIO */}
            {aiInspectorState === 'detached' && (
              <div 
                style={{ left: panelPositions.ai.x, top: panelPositions.ai.y }}
                className="fixed w-[320px] h-[480px] bg-neutral-900 shadow-2xl border border-indigo-500/30 rounded-xl z-40 flex flex-col pointer-events-auto backdrop-blur-md overflow-hidden animate-fade-in text-left"
              >
                <div 
                  onMouseDown={(e) => startDraggingPanel(e, 'ai')}
                  className="bg-neutral-950 p-2 text-[10px] font-mono select-none font-bold text-teal-400 border-b border-neutral-850 flex items-center justify-between cursor-move"
                >
                  <span className="flex items-center gap-1.5 uppercase">🧙‍♂️ AI STUDIO (FLUTUANTE)</span>
                  <div className="flex gap-1.5 bg-neutral-900 border border-neutral-800 p-0.5 rounded">
                    <button onClick={() => setAiInspectorState('normal')} className="px-1 hover:text-white pb-0.5" title="Reacoplar">
                      <Layout className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setAiInspectorState('collapsed')} className="px-1 hover:text-white" title="Fechar">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-neutral-900 overflow-auto">
                  <AIInspector
                    project={activeProject}
                    onUpdateSubtitles={handleUpdateSubtitles}
                    onUpdateSubtitlesTranslations={handleUpdateSubtitlesTranslations}
                    onApplySocialCuts={handleApplySocialCuts}
                    onApplySilenceCuts={handleApplySilenceCuts}
                    onApplyBackgroundRemoval={handleApplyBackgroundRemoval}
                    onAutoOrganizeMedia={handleAutoOrganizeMedia}
                    onApplyUpscaling={handleApplyUpscaling}
                    selectedClip={activeProject.clips.find(c => c.id === selectedClipId) || null}
                    onUpdateFilters={handleUpdateFilters}
                    onUpdateColorGrading={handleUpdateColorGrading}
                    onUpdateMotion={handleUpdateMotion}
                    onUpdateAudioSettings={handleUpdateAudioSettings}
                    activeTabOverride={aiInspectorTabOverride}
                  />
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* 3. PREMIUM DEEP BOTTOM FOOTER (Rodapé) */}
      <footer className="h-8 bg-neutral-950 border-t border-neutral-900 flex items-center justify-between px-3 shrink-0 text-[10px] font-semibold text-neutral-450 select-none z-20">
        {/* Left side: Workflow tabs list */}
        <div className="flex items-center gap-1.5 h-full">
          <button 
            onClick={() => handleSwitchLayoutMode('EDITING')}
            className={`px-3.5 h-full border-t-2 flex items-center transition ${layoutMode === 'EDITING' ? 'border-teal-400 text-teal-400 bg-neutral-900/40 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            🎬 Edição
          </button>
          
          <button 
            onClick={() => handleSwitchLayoutMode('COLOR')}
            className={`px-3.5 h-full border-t-2 flex items-center transition ${layoutMode === 'COLOR' ? 'border-teal-400 text-teal-400 bg-neutral-900/40 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            🎨 Cor (DaVinci)
          </button>

          <button 
            onClick={() => handleSwitchLayoutMode('MOTION')}
            className={`px-3.5 h-full border-t-2 flex items-center transition ${layoutMode === 'MOTION' ? 'border-teal-400 text-teal-400 bg-neutral-900/40 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            ✨ Motion Graphics
          </button>

          <button 
            onClick={() => handleSwitchLayoutMode('AUDIO')}
            className={`px-3.5 h-full border-t-2 flex items-center transition ${layoutMode === 'AUDIO' ? 'border-teal-400 text-teal-400 bg-neutral-900/40 font-bold' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
          >
            🎚️ Mixer de Áudio
          </button>

          <button 
            onClick={() => handleSwitchLayoutMode('IA_STUDIO')}
            className={`px-3.5 h-full border-t-2 flex items-center transition ${layoutMode === 'IA_STUDIO' ? 'border-teal-400 text-teal-400 bg-neutral-900/40 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            🧙‍♂️ IA Studio
          </button>

          <button 
            onClick={() => handleSwitchLayoutMode('MULTICAM')}
            className={`px-3.5 h-full border-t-2 flex items-center transition ${layoutMode === 'MULTICAM' ? 'border-teal-400 text-teal-400 bg-neutral-900/40 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            🎞️ Multicam (Dual)
          </button>

          <button 
            onClick={() => handleSwitchLayoutMode('STREAMING')}
            className={`px-3.5 h-full border-t-2 flex items-center transition ${layoutMode === 'STREAMING' ? 'border-teal-400 text-teal-400 bg-neutral-900/40 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            📡 Streaming
          </button>

          <button 
            onClick={() => handleSwitchLayoutMode('CINEMA')}
            className={`px-3.5 h-full border-t-2 flex items-center transition ${layoutMode === 'CINEMA' ? 'border-teal-400 text-teal-400 bg-neutral-900/40 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
          >
            🍿 Cinema
          </button>
        </div>

        {/* Right side: Hardware status label */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono font-medium text-neutral-500 hidden sm:inline">Buffers: Stereo ASIO • 512smp</span>
          <span className="w-px h-3 bg-neutral-900 hidden sm:inline"></span>
          <div className="flex items-center gap-1 font-mono text-[9px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/25 select-none font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
            GPU ACCELERATOR ACTIVE
          </div>
        </div>
      </footer>

      {/* 4. MODAL OVERLAY: SHORTCUT KEYS HELP */}
      {showShortcutHelp && (
        <div className="fixed inset-0 bg-black/85 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full text-left shadow-2xl relative">
            <button
              onClick={() => setShowShortcutHelp(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-neutral-500 hover:text-white hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-white text-lg font-bold flex items-center gap-2 mb-2 font-display">
              <Settings className="w-5 h-5 text-teal-400" /> Atalhos de Teclado
            </h3>
            <p className="text-xs text-neutral-400 mb-5">Atalhos comerciais para acelerar o rendimento de sua edição multipista:</p>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {MOCK_SHORTCUTS.map((shortcut, idx) => (
                <div key={idx} className="flex justify-between items-center bg-neutral-950 p-2 rounded border border-neutral-850 text-xs">
                  <span className="text-neutral-300">{shortcut.description}</span>
                  <kbd className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-750 font-mono text-teal-300 font-bold text-[10px] rounded border border-neutral-700 shadow">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowShortcutHelp(false)}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-neutral-950 font-bold rounded-lg text-xs transition uppercase"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SLIDEOUT PANEL: COMMENTS & TEAM COLLABORATION */}
      {showCommentsDrawer && (
        <div className="fixed inset-y-0 right-0 w-80 bg-neutral-950 border-l border-neutral-800 z-[90] shadow-2xl flex flex-col animate-slide-in">
          
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              Revisão Colaborativa
            </h3>
            <button 
              onClick={() => setShowCommentsDrawer(false)}
              className="p-1 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Comment list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeProject.comments.map((comment) => (
              <div key={comment.id} className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-850/65 text-xs flex gap-2.5">
                <img src={comment.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-neutral-800 object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-white truncate max-w-32">{comment.user}</span>
                    <span className="text-[9px] bg-blue-500/10 text-blue-400 font-mono px-1 py-0.5 rounded">@{comment.time.toFixed(1)}s</span>
                  </div>
                  <p className="text-neutral-300 mt-1.5 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* New Comment Submission Footer Form */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-925">
            <form onSubmit={handleAddComment}>
              <span className="text-[10px] text-neutral-500 font-mono block mb-1">Inserir Nota em {currentTime.toFixed(1)}s:</span>
              <textarea
                rows={2}
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Ex: Legenda desalinhada, ajustar volume..."
                className="w-full p-2 bg-neutral-950 text-xs text-white border border-neutral-800 rounded focus:outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                className="mt-2 w-full p-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded transition uppercase"
              >
                Gravar Nota de Equipe
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
