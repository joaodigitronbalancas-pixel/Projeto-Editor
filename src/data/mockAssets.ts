import { Asset, Track, Clip, Project } from "../types";

export const MOCK_ASSETS: Asset[] = [
  {
    id: "asset-1",
    name: "Cyberpunk City Skyline.mp4",
    type: "video",
    url: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd", // Unsplash neon
    duration: 34,
    size: "185 MB",
    resolution: "3840x2160 (4K)"
  },
  {
    id: "asset-2",
    name: "Mountain Drone Flight.mp4",
    type: "video",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    duration: 52,
    size: "240 MB",
    resolution: "3840x2160 (4K)"
  },
  {
    id: "asset-3",
    name: "Cozy Log Fireplace.mp4",
    type: "video",
    url: "https://images.unsplash.com/photo-1545224497-5d35e30ee97d",
    duration: 120,
    size: "420 MB",
    resolution: "1920x1080 (1080p)"
  },
  {
    id: "asset-4",
    name: "Product Showcase Close-up.mp4",
    type: "video",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    duration: 15,
    size: "82 MB",
    resolution: "3840x2160 (4K)"
  },
  {
    id: "asset-5",
    name: "Acoustic Guitar Background.wav",
    type: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 372,
    size: "64 MB",
    resolution: "44.1 kHz / 16-bit"
  },
  {
    id: "asset-6",
    name: "Cyber Bass Synthesizer.wav",
    type: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 423,
    size: "72 MB",
    resolution: "48 kHz / 24-bit"
  },
  {
    id: "asset-7",
    name: "Nature Ambient Silence.wav",
    type: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 180,
    size: "30 MB",
    resolution: "48 kHz"
  },
  {
    id: "asset-8",
    name: "Retro Sunset Logo.png",
    type: "image",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    duration: 5,
    size: "4.2 MB",
    resolution: "2048x2048"
  },
  {
    id: "asset-9",
    name: "Overlays & Lens Flare.png",
    type: "image",
    url: "https://images.unsplash.com/photo-1510519138101-570d1dca3d66",
    duration: 8,
    size: "12.4 MB",
    resolution: "4096x2160"
  },
];

export const MOCK_TRANSITIONS = [
  { id: "dissolve", name: "Cross Dissolve", type: "Dissolve", duration: 1.0 },
  { id: "fade-black", name: "Fade to Black", type: "Fade", duration: 0.8 },
  { id: "fade-white", name: "Fade to White", type: "Fade", duration: 0.8 },
  { id: "wipe-left", name: "Wipe Left", type: "Wipe", duration: 1.2 },
  { id: "wipe-up", name: "Wipe Up", type: "Wipe", duration: 1.2 },
  { id: "zoom-in", name: "Zoom Transition", type: "Zoom", duration: 1.5 },
  { id: "glitch", name: "Digital Glitch", type: "FX", duration: 0.5 },
];

export const MOCK_LUTS = [
  { id: "none", name: "Nenhum (RAW / Flat)" },
  { id: "lut-cinema", name: "Cinema Teal & Orange (Hollywood Standard)" },
  { id: "lut-vintage", name: "1972 Vintage Nostalgia (Kodak Poly)" },
  { id: "lut-cyberpunk", name: "Cyber Neon Glow (Pink-Cyan contrast)" },
  { id: "lut-bw", name: "High Contrast Monocromo (Fujifilm Acros)" },
  { id: "lut-warm", name: "Warm Sunsets Sunset Warmth" },
  { id: "lut-cold", name: "Scandi Blue Cold Chill" },
];

export const MOCK_EFFECTS = [
  { id: "fx-chromakey", name: "Chroma Key (Verde)", category: "Chroma Key", desc: "Remove cores de fundo específicas (verde/azul)." },
  { id: "fx-blur", name: "Desfoque Guassiano (Blur)", category: "Blur", desc: "Desfoca o clipe de forma uniforme." },
  { id: "fx-sharpen", name: "Nitidez Profissional", category: "Sharpen", desc: "Realça as bordas do objeto de cena." },
  { id: "fx-glow", name: "Glow Radiante", category: "Stylize", desc: "Adiciona luz difusa às áreas de contraste." },
  { id: "fx-distortion", name: "Distorção de Lente", category: "Distortion", desc: "Simula lentes Fish-eye ou distorção radial." },
  { id: "fx-stabilize", name: "Estabilização por Giroscópio", category: "Utility", desc: "Elimina balanço indesejados da câmera." },
  { id: "fx-motiontrack", name: "Rastreador de Presença AI", category: "AI Motion", desc: "Rastreia rostos ou caixas delimitadoras de forma automatizada." },
  { id: "fx-masks", name: "Máscara de Recorte Circular", category: "Mask", desc: "Corta uma área e cria recortes de composição." }
];

export const MOCK_TEMPLATES = [
  { id: "tp-lowerthird", name: "Social Badge Lower-Third", category: "Títulos", desc: "Legenda de redes sociais com animação suave." },
  { id: "tp-cyberintro", name: "Neon Cyberpunk Title Card", category: "Aberturas", desc: "Ideal para títulos cyberpunk de canal tech." },
  { id: "tp-ytshorts", name: "YouTube Shorts Split Screen Template", category: "Formato", desc: "Divide a tela centralizando facecam." },
  { id: "tp-cinematicintro", name: "Cinematic Letterbox Fade", category: "Efeitos", desc: "Aplica barras pretas de aspecto de cinema e intro escura." },
];

export const INITIAL_TRACKS: Track[] = [
  { id: "track-v3", name: "Capa & Vinheta (V3)", type: "video", muted: false, locked: false, volume: 100 },
  { id: "track-v2", name: "Imagens/Overlays (V2)", type: "video", muted: false, locked: false, volume: 100 },
  { id: "track-v1", name: "Vídeo Base (V1)", type: "video", muted: false, locked: false, volume: 100 },
  { id: "track-t1", name: "Textos/Falas (T1)", type: "text", muted: false, locked: false, volume: 100 },
  { id: "track-a1", name: "Mix Falas/Voz (A1)", type: "audio", muted: false, locked: false, volume: 100 },
  { id: "track-a2", name: "Banda Sonora (A2)", type: "audio", muted: false, locked: false, volume: 100 },
  { id: "track-a3", name: "Foley/Sound FX (A3)", type: "audio", muted: false, locked: false, volume: 100 },
];

export const INITIAL_CLIPS: Clip[] = [
  {
    id: "clip-1",
    name: "Mountain Drone Flight.mp4",
    type: "video",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200",
    start: 2,
    duration: 18,
    sourceStart: 0,
    sourceDuration: 52,
    trackId: "track-v1",
    color: "#0d9488", // teal-600
    speed: 1.0,
    filters: { brightness: 100, contrast: 100, saturate: 110, blur: 0, hueRotate: 0, grayscale: 0, sepia: 0, invert: 0 },
    colorGrading: { temp: 0, tint: 0, exposure: 10, shadows: 0, highlights: 0, lutId: "none" }
  },
  {
    id: "clip-2",
    name: "Cyberpunk City Skyline.mp4",
    type: "video",
    url: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd",
    thumbnail: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=200",
    start: 20,
    duration: 15,
    sourceStart: 5,
    sourceDuration: 34,
    trackId: "track-v1",
    color: "#0d9488", // teal-600
    speed: 1.0,
    filters: { brightness: 100, contrast: 120, saturate: 140, blur: 0, hueRotate: 0, grayscale: 0, sepia: 0, invert: 0 },
    colorGrading: { temp: -15, tint: 10, exposure: 0, shadows: 5, highlights: -5, lutId: "lut-cyberpunk" },
    chromaKey: { enabled: false, color: "#00ff00", similarity: 40, smoothness: 10 }
  },
  {
    id: "clip-3",
    name: "Acoustic Guitar Background.wav",
    type: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    start: 0,
    duration: 35,
    sourceStart: 0,
    sourceDuration: 372,
    trackId: "track-a1",
    color: "#2563eb", // blue-600
    speed: 1.0,
    volume: 80,
    audioSettings: {
      volume: 80,
      pan: 0,
      equalizer: { low: 2, mid: -1, high: 4 },
      compressor: true,
      noiseReduction: false,
      noiseLevel: 20,
      normalize: true
    }
  },
  {
    id: "clip-4",
    name: "Retro Sunset Logo.png",
    type: "image",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200",
    start: 10,
    duration: 8,
    sourceStart: 0,
    sourceDuration: 5,
    trackId: "track-v2",
    color: "#db2777", // pink-600
    speed: 1.0,
    filters: { brightness: 110, contrast: 100, saturate: 100, blur: 0, hueRotate: 0, grayscale: 0, sepia: 0, invert: 0 },
    motion: { scale: 120, positionX: -40, positionY: 40, opacity: 90, rotation: 0 }
  },
  {
    id: "clip-5",
    name: "Inscreva-se!",
    type: "text",
    url: "",
    start: 5,
    duration: 6,
    sourceStart: 0,
    sourceDuration: 10,
    trackId: "track-t1",
    color: "#d97706", // amber-600
    speed: 1.0,
    textContent: "🔥 INSCREVA-SE NO CANAL E ATIVE O SININHO! 🔔",
    textStyle: { fontSize: 24, textColor: "#ffffff", backgroundColor: "#ff0000bb", fontFamily: "sans", align: "center" }
  }
];

export const INITIAL_SUBTITLES = [
  { id: "sub-1", startTime: 1.0, endTime: 4.8, text: "Bem-vindos ao teste prático do VisionCut Pro!" },
  { id: "sub-2", startTime: 5.5, endTime: 11.2, text: "Este vídeo ilustra a magnífica união de timeline multipista e efeitos sob medida." },
  { id: "sub-3", startTime: 13.0, endTime: 18.5, text: "Com filtros de alta performance que alteram cores em tempo real no rodapé." },
  { id: "sub-4", startTime: 21.0, endTime: 27.2, text: "Ative recursos de Inteligência Artificial para traduzir ou remover ruído." },
  { id: "sub-5", startTime: 29.0, endTime: 33.5, text: "VisionCut Pro: O editor ideal para suas produções e redes sociais." }
];

export const INITIAL_MARKERS = [
  { id: "mk-1", time: 2.0, color: "#ef4444", label: "Abertura Drone" },
  { id: "mk-2", time: 20.0, color: "#3b82f6", label: "Corte Cyber City", chapter: true },
  { id: "mk-3", time: 30.0, color: "#10b981", label: "Fim da Trilha" }
];

export const MOCK_SHORTCUTS = [
  { key: "Espaço", description: "Inicia / Pausa reprodução da Timeline" },
  { key: "S", description: "Dividir Clipe Selecionado (Split Edit)" },
  { key: "Delete", description: "Deletar Clipe Selecionado" },
  { key: "N", description: "Ativar / Desativar Snap Magnético Inteligente" },
  { key: "Setas Esq / Dir", description: "Avance ou retroceda 1 frame na Timeline" },
  { key: "Z", description: "Ativar ferramenta Zoom na track" },
  { key: "M", description: "Adicionar Marcador na agulha atual" },
  { key: "Ctrl + Z", description: "Desfazer última alteração de edição" },
  { key: "Ctrl + Y", description: "Refazer última alteração de edição" },
];
