import { useState, useEffect } from "react";
import { Download, RefreshCcw, Filter } from "lucide-react";
import { Asset, AssetType, AssetTypeCount } from "@/types/asset-types";
import { Button } from "@/components/ui/button";
import { AssetCard } from "@/components/asset-card";
import { ProgressBar } from "@/components/progress-bar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { downloadAssets } from "@/utils/asset-scanner";

interface ScanResultsProps {
  url: string;
  assets: Asset[];
  isScanning: boolean;
  scanProgress: number;
  error?: string;
  onDownload: (selectedAssets: string[], filename: string, compressionLevel: string) => void;
  onRescan: () => void;
}

export function ScanResults({
  url,
  assets,
  isScanning,
  scanProgress,
  error,
  onDownload,
  onRescan,
}: ScanResultsProps) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<AssetType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadFilename, setDownloadFilename] = useState("assets");
  const [compressionLevel, setCompressionLevel] = useState<string>("medium");
  const [typeCounts, setTypeCounts] = useState<AssetTypeCount[]>([]);

  useEffect(() => {
    if (!assets.length) return;
    
    setSelectedAssets(assets.filter(asset => asset.selected).map(asset => asset.id));
    
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace("www.", "");
      setDownloadFilename(`${hostname}-assets`);
    } catch (e) {
      setDownloadFilename("website-assets");
    }
    
    const counts: Record<string, AssetTypeCount> = {};
    
    assets.forEach(asset => {
      if (!counts[asset.type]) {
        counts[asset.type] = { 
          type: asset.type, 
          count: 0, 
          size: 0 
        };
      }
      counts[asset.type].count++;
      counts[asset.type].size += asset.size || 0;
    });
    
    setTypeCounts(Object.values(counts));
  }, [assets, url]);

  const handleToggleSelect = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedAssets(prev => [...prev, id]);
    } else {
      setSelectedAssets(prev => prev.filter(assetId => assetId !== id));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const filteredAssets = filterAssets().map(asset => asset.id);
      setSelectedAssets(filteredAssets);
    } else {
      setSelectedAssets([]);
    }
  };

  const filterAssets = () => {
    return assets.filter(asset => {
      const matchesType = filterType === "all" || asset.type === filterType;
      const matchesSearch = !searchQuery || 
        asset.filename.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getTotalSelectedSize = (): string => {
    const total = assets
      .filter(asset => selectedAssets.includes(asset.id))
      .reduce((sum, asset) => sum + (asset.size || 0), 0);
    return formatBytes(total);
  };

  const filteredAssets = filterAssets();

  const handleZipDownload = async () => {
    try {
      const selectedAssetIds = filteredAssets
        .filter(asset => selectedAssets.includes(asset.id))
        .map(asset => asset.id);

      if (selectedAssetIds.length === 0) {
        return;
      }

      const result = await downloadAssets(
        assets.filter(asset => selectedAssetIds.includes(asset.id)),
        downloadFilename,
        compressionLevel,
        (progress) => {
          onDownload(selectedAssetIds, downloadFilename, compressionLevel);
        }
      );

      if (typeof result === 'string') {
        const link = document.createElement('a');
        link.href = result;
        link.download = `${downloadFilename}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to download assets:', error);
    }
  };

  return (
    <div className="w-full space-y-6 mt-8">
      {isScanning && (
        <div className="space-y-3">
          <h2 className="text-xl font-medium text-white">Scanning {url}</h2>
          <ProgressBar progress={scanProgress} />
          <p className="text-sm text-harvester-200">
            Discovered {assets.length} assets so far...
          </p>
        </div>
      )}

      {!isScanning && error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
          <h3 className="font-medium mb-2">Error scanning website</h3>
          <p className="text-sm">{error}</p>
          <Button 
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={onRescan}
          >
            <RefreshCcw className="h-4 w-4 mr-1" /> Try Again
          </Button>
        </div>
      )}

      {!isScanning && !error && assets.length > 0 && (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-medium text-white">
                Assets from <span className="text-harvester-300">{url}</span>
              </h2>
              <p className="text-harvester-200 mt-1">
                Found {assets.length} assets ({getTotalSelectedSize()} selected)
              </p>
            </div>
            <Button 
              variant="outline"
              size="sm"
              className="text-harvester-300 border-harvester-700 hover:bg-harvester-800"
              onClick={onRescan}
            >
              <RefreshCcw className="h-4 w-4 mr-1" /> Rescan
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    variant={filterType === "all" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setFilterType("all")}
                    className="h-7 text-xs"
                  >
                    All
                  </Button>
                  {typeCounts.map(typeCount => (
                    <Button
                      key={typeCount.type}
                      variant={filterType === typeCount.type ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setFilterType(typeCount.type)}
                      className="h-7 text-xs"
                    >
                      {typeCount.type}
                      <Badge variant="outline" className="ml-1 text-xs">
                        {typeCount.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
                
                <div className="relative w-full sm:w-auto">
                  <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-harvester-500" />
                  <Input
                    type="search"
                    placeholder="Filter assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-sm bg-harvester-900/50 border-harvester-700 text-white placeholder:text-harvester-400/60 w-full sm:w-auto"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="select-all"
                    className="rounded bg-harvester-900 border-harvester-600 text-harvester-600"
                    checked={
                      filteredAssets.length > 0 &&
                      filteredAssets.every((asset) => selectedAssets.includes(asset.id))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <label htmlFor="select-all" className="text-sm text-harvester-200">
                    Select all {filterType !== "all" ? filterType : ""} assets ({filteredAssets.length})
                  </label>
                </div>
              </div>

              {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredAssets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={{
                        ...asset,
                        selected: selectedAssets.includes(asset.id),
                      }}
                      onToggleSelect={handleToggleSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-harvester-900/30 rounded-lg p-8 text-center">
                  <p className="text-harvester-300">No assets match your filter criteria</p>
                </div>
              )}
            </div>

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
                  onClick={handleZipDownload}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download {selectedAssets.length} Assets
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
