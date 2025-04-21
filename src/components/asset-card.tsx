
import { useState } from "react";
import { Eye, Folder, FileType, FileText, Image as ImageIcon, X } from "lucide-react";
import { Asset } from "@/types/asset-types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface AssetCardProps {
  asset: Asset;
  onToggleSelect: (id: string, selected: boolean) => void;
}

export function AssetCard({ asset, onToggleSelect }: AssetCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

  // Format file size
  const formatSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // Get appropriate icon based on asset type
  const getAssetIcon = () => {
    switch (asset.type) {
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "stylesheet":
        return <FileType className="h-5 w-5" />;
      case "script":
        return <FileText className="h-5 w-5" />;
      case "font":
        return <FileText className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      default:
        return <Folder className="h-5 w-5" />;
    }
  };

  // Get type badge color
  const getTypeBadgeColor = () => {
    switch (asset.type) {
      case "image":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      case "stylesheet":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "script":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/40";
      case "font":
        return "bg-green-500/20 text-green-300 border-green-500/40";
      case "document":
        return "bg-red-500/20 text-red-300 border-red-500/40";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/40";
    }
  };

  return (
    <div className={`relative rounded-lg overflow-hidden bg-white/5 border border-white/10 transition-all ${asset.selected ? 'ring-2 ring-harvester-500' : ''}`}>
      <div className="absolute top-2 right-2 z-10">
        <Checkbox
          checked={asset.selected}
          onCheckedChange={(checked) => onToggleSelect(asset.id, !!checked)}
          className="bg-white/20 border-harvester-300 data-[state=checked]:bg-harvester-600"
        />
      </div>

      <div className="p-3">
        <div className="h-32 bg-black/30 rounded flex items-center justify-center overflow-hidden">
          {asset.type === "image" && asset.previewUrl ? (
            <img 
              src={asset.previewUrl} 
              alt={asset.filename} 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "placeholder.svg"; 
                e.currentTarget.classList.add("p-4");
              }} 
            />
          ) : (
            <div className="text-4xl text-gray-400">{getAssetIcon()}</div>
          )}
        </div>

        <div className="mt-3">
          <div className="flex items-start justify-between gap-1">
            <p className="text-sm font-medium text-white truncate" title={asset.filename}>
              {asset.filename}
            </p>
            <Badge className={`text-xs px-2 py-0 ${getTypeBadgeColor()}`}>
              {asset.type}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{formatSize(asset.size)}</span>
            
            {(asset.type === "image" || asset.type === "document") && (
              <Button
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs text-harvester-300 hover:text-harvester-200"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="h-3 w-3 mr-1" /> Preview
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-harvester-900 border border-harvester-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-harvester-800">
              <h3 className="font-medium text-white">{asset.filename}</h3>
              <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 flex items-center justify-center bg-black/30 h-[70vh] overflow-auto">
              {asset.type === "image" ? (
                <img src={asset.previewUrl || asset.url} alt={asset.filename} className="max-w-full max-h-full object-contain" />
              ) : (
                <iframe src={asset.url} title={asset.filename} className="w-full h-full"></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
