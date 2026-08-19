export type TabType = 'downloader' | 'pdf' | 'utilities' | 'image-converter' | 'code' | 'about' | 'privacy' | 'terms' | 'disclaimer' | 'contact';

export type PlatformType = 'tiktok' | 'instagram' | 'youtube' | 'auto' | 'other';

export interface VideoMetadata {
  platform: PlatformType;
  title: string;
  author: string;
  authorName?: string;
  authorAvatar?: string;
  thumbnail: string;
  duration?: string;
  views?: string;
  likes?: string;
  downloadUrlMp4: string;
  downloadUrlMp4Hd?: string;
  downloadUrlMp3: string;
  sizeMp4?: string;
  sizeMp3?: string;
  dimensions?: string;
  isDemoFallback?: boolean;
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  platform: PlatformType;
  thumbnail: string;
  format: 'mp4-hd' | 'mp4-sd' | 'mp3' | 'cover';
  date: string;
  url: string;
}

export interface ParsedPdf {
  name: string;
  size: number;
  totalPages: number;
  fullText: string;
  pages: { pageNumber: number; text: string }[];
  wordCount: number;
  charCount: number;
}

export interface AdSenseConfig {
  enabled: boolean;
  publisherId: string;
  testMode: boolean;
}
