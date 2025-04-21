
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Asset } from "@/types/asset-types";

interface DownloadPanelProps {
  downloadFilename: string;
  setDownloadFilename: (filename: string) => void;
  compressionLevel: string;
  setCompressionLevel: (level: string) => void;
  selectedAssets: string[];
  assets: Asset[];
  onDownload: () => void;
  formatBytes: (bytes: number) => string;
}

export function DownloadPanel({
  downloadFilename,
  setDownloadFilename,
  compressionLevel,
  setCompressionLevel,
  selectedAssets,
  assets,
  onDownload,
  formatBytes
}: DownloadPanelProps) {
  const getTotalSelectedSize = (): string => {
    const total = assets
      .filter(asset => selectedAssets.includes(asset.id))
      .reduce((sum, asset) => sum + (asset.size || 0), 0);
    return formatBytes(total);
  };

  return (
    <div className="bg-harvester-900/30 rounded-lg p-4 border border-harvester-800">
      <h3 className="text-lg font-medium text-white mb-4">Download Options</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-harvester-300 mb-1">Output filename</label>
          <Input
            type="text"
            value={downloadFilename}
            onChange={(e) => setDownloadFilename(e.target.value)}
            className="bg-harvester-800 border-harvester-700 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm text-harvester-300 mb-1">Compression level</label>
          <select
            value={compressionLevel}
            onChange={(e) => setCompressionLevel(e.target.value)}
            className="w-full rounded-md bg-harvester-800 border-harvester-700 text-white py-2 px-3"
          >
            <option value="none">None (Faster)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="maximum">Maximum (Smaller size)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-harvester-300 mb-1">Selected assets</label>
          <p className="text-white text-lg font-medium">
            {selectedAssets.length} / {assets.length}
          </p>
          <p className="text-xs text-harvester-400">
            Total size: {getTotalSelectedSize()}
          </p>
        </div>
        
        <Button 
          className="w-full bg-harvester-600 hover:bg-harvester-500 text-white"
          disabled={selectedAssets.length === 0}
          onClick={onDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          Download {selectedAssets.length} Assets
        </Button>
      </div>
    </div>
  );
}
