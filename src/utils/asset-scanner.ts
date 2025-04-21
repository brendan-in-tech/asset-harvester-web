
import { Asset, AssetType, ScanResult } from "@/types/asset-types";
import { v4 as uuidv4 } from "uuid";

// Determine asset type based on URL and MIME type
const getAssetType = (url: string, mimeType?: string): AssetType => {
  const extension = url.split(".").pop()?.toLowerCase() || "";
  
  // Image types
  if (
    mimeType?.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "svg", "webp", "ico", "bmp"].includes(extension)
  ) {
    return "image";
  }
  
  // Stylesheet types
  if (
    mimeType === "text/css" ||
    extension === "css"
  ) {
    return "stylesheet";
  }
  
  // Script types
  if (
    mimeType === "application/javascript" ||
    mimeType === "text/javascript" ||
    extension === "js"
  ) {
    return "script";
  }
  
  // Font types
  if (
    mimeType?.includes("font") ||
    ["woff", "woff2", "ttf", "otf", "eot"].includes(extension)
  ) {
    return "font";
  }
  
  // Document types
  if (
    ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(extension) ||
    mimeType === "application/pdf"
  ) {
    return "document";
  }
  
  // Default to other
  return "other";
};

// Get filename from URL
const getFilenameFromUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    
    // Get the last part of the path (filename)
    let filename = pathname.split("/").pop() || "";
    
    // If no filename or ends with /, use the hostname
    if (!filename || filename === "") {
      filename = parsedUrl.hostname;
    }
    
    // Remove query params
    filename = filename.split("?")[0];
    
    // Ensure we have a valid filename
    return filename || "file";
  } catch (error) {
    // If URL parsing fails, return a generic name
    return "file";
  }
};

// Mock implementation - in a real app this would be replaced with actual API calls
export const scanWebsite = async (
  url: string,
  onProgress: (progress: number, assets: Asset[]) => void
): Promise<ScanResult> => {
  // This is a mock implementation
  try {
    // We'll simulate asset discovery over time
    const mockAssets: Asset[] = [];
    const assetCount = Math.floor(Math.random() * 30) + 5; // 5-35 assets
    
    // Prepare asset types to simulate
    const assetTypes: AssetType[] = ["image", "stylesheet", "script", "font", "document", "other"];
    
    // Simulate discovering assets over time
    for (let i = 0; i < assetCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
      
      // Generate mock asset
      const type = assetTypes[Math.floor(Math.random() * assetTypes.length)];
      const extension = getRandomExtensionForType(type);
      const filename = `asset_${i + 1}${extension}`;
      const size = Math.floor(Math.random() * 1000000) + 1000; // 1KB to 1MB
      
      const asset: Asset = {
        id: uuidv4(),
        url: `${url}/assets/${filename}`,
        filename,
        type,
        size,
        // For images, generate a random color placeholder
        previewUrl: type === "image" ? getRandomColorImage() : undefined,
        selected: true
      };
      
      mockAssets.push(asset);
      
      // Report progress
      const progress = ((i + 1) / assetCount) * 100;
      onProgress(progress, [...mockAssets]);
    }
    
    // Return completed scan result
    return {
      url,
      assets: mockAssets,
      timestamp: Date.now(),
      status: "complete"
    };
  } catch (error) {
    // Handle errors
    return {
      url,
      assets: [],
      timestamp: Date.now(),
      status: "error",
      error: error instanceof Error ? error.message : "Failed to scan website"
    };
  }
};

// Helper to get random extension for an asset type
const getRandomExtensionForType = (type: AssetType): string => {
  switch (type) {
    case "image":
      return [".jpg", ".png", ".svg", ".webp", ".gif"][Math.floor(Math.random() * 5)];
    case "stylesheet":
      return ".css";
    case "script":
      return ".js";
    case "font":
      return [".woff", ".woff2", ".ttf"][Math.floor(Math.random() * 3)];
    case "document":
      return [".pdf", ".doc", ".txt"][Math.floor(Math.random() * 3)];
    default:
      return [".json", ".xml", ".ico"][Math.floor(Math.random() * 3)];
  }
};

// Generate a random colored image for mockup
const getRandomColorImage = (): string => {
  const colors = [
    "#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6",
    "#1abc9c", "#d35400", "#c0392b", "#2980b9", "#8e44ad"
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // Return a data URL for a colored square
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='${color.replace('#', '%23')}' /%3E%3C/svg%3E`;
};

// Mock implementation of download assets
export const downloadAssets = (
  assets: Asset[],
  filename: string,
  compressionLevel: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      onProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(interval);
        resolve(`${filename}.zip`); // In a real app, we'd return the actual download URL
      }
    }, 100);
  });
};
