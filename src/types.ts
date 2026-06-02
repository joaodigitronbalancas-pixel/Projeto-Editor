export type ClipType = 'video' | 'audio' | 'image' | 'text';

export interface VideoFilters {
  brightness: number; // 0 - 200 (100 = original)
  contrast: number; // 0 - 200 (100 = original)
  saturate: number; // 0 - 200 (100 = original)
  blur: number; // 0 - 50 px
  hueRotate: number; // 0 - 360 deg
  grayscale: number; // 0 - 100%
  sepia: number; // 0 - 100%
  invert: number; // 0 - 100%
}

export interface ColorGrading {
  temp: number; // -100 to +100 (warmth)
  tint: number; // -100 to +100
  exposure: number; // -100 to +100
  shadows: number; // -100 to +100
  highlights: number; // -100 to +100
  lutId: string; // 'none' or preset ID
}

export interface Keyframe {
  time: number; // Relative offset in seconds from clip start
  value: number;
}

export interface MotionParams {
  scale: number; // 50 to 200
  positionX: number; // px offset
  positionY: number; // px offset
  opacity: number; // 0 to 100
  rotation: number; // degrees
}

export interface AudioSettings {
  volume: number; // 0 to 100
  pan: number; // -100 (left) to 100 (right)
  equalizer: {
    low: number; // -15dB to +15dB
    mid: number;
    high: number;
  };
  compressor: boolean;
  noiseReduction: boolean;
  noiseLevel: number; // 0 to 100
  normalize: boolean;
}

export interface Clip {
  id: string;
  name: string;
  type: ClipType;
  url: string; // Can be mock local Blob URL
  thumbnail?: string;
  start: number; // Start offset on timeline in seconds
  duration: number; // Duration on timeline in seconds
  sourceStart: number; // Offset in source file (for Slip Edit) in seconds
  sourceDuration: number; // Total length of raw media
  trackId: string;
  color: string;
  
  // Settings
  volume?: number;
  audioSettings?: AudioSettings;
  filters?: VideoFilters;
  colorGrading?: ColorGrading;
  motion?: MotionParams;
  chromaKey?: {
    enabled: boolean;
    color: string; // hex
    similarity: number; // 0-100
    smoothness: number; // 0-100
  };
  aiBackgroundRemoval?: boolean;
  speed: number; // 0.1 to 10.0
  transitionIn?: {
    id: string;
    duration: number; // seconds
  };
  transitionOut?: {
    id: string;
    duration: number; // seconds
  };
  textContent?: string;
  textStyle?: {
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    fontFamily: string;
    align: 'left' | 'center' | 'right';
  };
}

export interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text';
  muted: boolean;
  locked: boolean;
  volume: number; // 0 to 100
  solo?: boolean;
}

export interface Marker {
  id: string;
  time: number; // location in seconds
  color: string;
  label: string;
  chapter?: boolean;
}

export interface Subtitle {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  translatedText?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: ClipType;
  url: string;
  duration: number; // in seconds
  size?: string;
  resolution?: string;
}

export interface Sequence {
  id: string;
  name: string;
  createdAt: number;
}

export interface Version {
  id: string;
  name: string;
  timestamp: number;
  description: string;
}

export interface CollaborationComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: number; // time on timeline (seconds)
  timestamp: number; // actual post time
}

export interface Project {
  id: string;
  name: string;
  sequences: Sequence[];
  currentSequenceId: string;
  tracks: Track[];
  clips: Clip[];
  markers: Marker[];
  subtitles: Subtitle[];
  versions: Version[];
  comments: CollaborationComment[];
  audioMixer: {
    masterVolume: number;
    channels: Record<string, { fader: number; pan: number; muted: boolean }>;
  };
}

export interface ProductivityStats {
  editingTimeMinutes: number;
  exportsCount: number;
  renderedFrames: number;
  aiOperationsCount: number;
}
