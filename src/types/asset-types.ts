
// Type definitions for the Asset Harvester application

// Asset type classification
export type AssetType = 
  | "image" 
  | "stylesheet" 
  | "script" 
  | "font" 
  | "document"
  | "html"  // Added HTML type
  | "other";

// Single asset object
export interface Asset {
  id: string;
  url: string;
  filename: string;
  type: AssetType;
  size?: number; // in bytes
  previewUrl?: string;
  selected: boolean;
}

// Scan status enum
export type ScanStatus = 
  | "idle"
  | "scanning" 
  | "complete" 
  | "error";

// Scan result
export interface ScanResult {
  url: string;
  timestamp: number;
  assets: Asset[];
  status: ScanStatus;
  error?: string;
}

// Compression options
export type CompressionLevel = "none" | "medium" | "maximum";

// Download options
export interface DownloadOptions {
  filename: string;
  compressionLevel: CompressionLevel;
  selectedAssets: string[]; // Asset IDs
}

// History entry
export interface HistoryEntry {
  id: string;
  url: string;
  timestamp: number;
  assetCount: number;
  downloadCount: number;
}

// Asset count by type
export interface AssetTypeCount {
  type: AssetType;
  count: number;
  size: number;
}
