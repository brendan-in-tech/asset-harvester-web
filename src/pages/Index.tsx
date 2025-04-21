
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { PageContainer } from "@/components/ui/page-container";
import { Header } from "@/components/header";
import { UrlForm } from "@/components/url-form";
import { ScanResults } from "@/components/scan-results";
import { HistoryPanel } from "@/components/history-panel";
import { Asset, ScanStatus, HistoryEntry } from "@/types/asset-types";
import { scanWebsite, downloadAssets } from "@/utils/asset-scanner";
import { getHistory, addToHistory, clearHistory } from "@/utils/storage";

export default function Index() {
  const { toast } = useToast();
  
  // State
  const [url, setUrl] = useState<string>("");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Handle URL form submission
  const handleScan = async (inputUrl: string) => {
    setUrl(inputUrl);
    setAssets([]);
    setError(undefined);
    setScanStatus("scanning");
    setScanProgress(0);

    try {
      const result = await scanWebsite(
        inputUrl,
        (progress, discoveredAssets) => {
          setScanProgress(progress);
          setAssets(discoveredAssets);
        }
      );

      // Update state based on scan result
      setScanStatus(result.status);
      setAssets(result.assets);
      
      if (result.status === "error" && result.error) {
        setError(result.error);
        toast({
          title: "Scan Error",
          description: result.error,
          variant: "destructive"
        });
      } else if (result.assets.length === 0) {
        setError("No assets found on this website");
        toast({
          title: "No Assets Found",
          description: "We couldn't find any assets on this website",
          variant: "default"
        });
      } else {
        // Success - add to history
        const historyEntry: HistoryEntry = {
          id: uuidv4(),
          url: inputUrl,
          timestamp: Date.now(),
          assetCount: result.assets.length,
          downloadCount: 0
        };
        addToHistory(historyEntry);
        setHistory(getHistory());
        
        toast({
          title: "Scan Complete",
          description: `Found ${result.assets.length} assets on ${new URL(inputUrl).hostname}`,
          variant: "default"
        });
      }
    } catch (err) {
      setScanStatus("error");
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Scan Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Handle download
  const handleDownload = async (
    selectedAssetIds: string[],
    filename: string,
    compressionLevel: string
  ) => {
    if (selectedAssetIds.length === 0) {
      toast({
        title: "No Assets Selected",
        description: "Please select at least one asset to download",
        variant: "default"
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      // Get selected assets
      const selectedAssets = assets.filter(asset => 
        selectedAssetIds.includes(asset.id)
      );

      // Start download
      toast({
        title: "Starting Download",
        description: `Preparing ${selectedAssets.length} assets...`,
        variant: "default"
      });
      
      // Mock download call
      await downloadAssets(
        selectedAssets,
        filename,
        compressionLevel,
        (progress) => setDownloadProgress(progress)
      );

      // Update history with download
      const historyEntry = history.find(entry => entry.url === url);
      if (historyEntry) {
        const updatedEntry = {
          ...historyEntry,
          downloadCount: historyEntry.downloadCount + 1
        };
        addToHistory(updatedEntry);
        setHistory(getHistory());
      }

      toast({
        title: "Download Complete",
        description: `${selectedAssets.length} assets downloaded successfully`,
        variant: "default"
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Download failed";
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle rescan
  const handleRescan = () => {
    if (url) {
      handleScan(url);
    }
  };

  // Handle history clear
  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Your scan history has been cleared",
      variant: "default"
    });
  };

  return (
    <PageContainer>
      <Header />
      
      <div className="mt-10 mb-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-harvester-200 to-purple-300 text-transparent bg-clip-text">
            Web Asset Harvester
          </h1>
          <p className="text-harvester-200 max-w-2xl mx-auto">
            Extract images, stylesheets, scripts, fonts and more from any website.
            Just enter the URL below and we'll scan the site for downloadable assets.
          </p>
        </div>

        <UrlForm 
          onSubmit={handleScan} 
          isScanning={scanStatus === "scanning"} 
        />

        <HistoryPanel 
          history={history}
          onSelect={handleScan}
          onClear={handleClearHistory}
        />

        <ScanResults
          url={url}
          assets={assets}
          isScanning={scanStatus === "scanning"}
          scanProgress={scanProgress}
          error={error}
          onDownload={handleDownload}
          onRescan={handleRescan}
        />
        
        {isDownloading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-harvester-900 border border-harvester-700 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-medium text-white mb-4">Downloading Assets</h3>
              <div className="w-full bg-harvester-800 rounded-full h-4 mb-3">
                <div 
                  className="bg-gradient-to-r from-harvester-600 to-harvester-400 h-4 rounded-full transition-all duration-200"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <p className="text-harvester-200">
                {downloadProgress < 100 
                  ? `Processing... ${Math.round(downloadProgress)}%` 
                  : 'Finalizing download...'}
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-harvester-900/80 backdrop-blur-sm py-3 border-t border-harvester-800">
        <div className="container mx-auto px-4 text-center text-harvester-400 text-sm">
          Asset Harvester — A tool for extracting assets from websites
        </div>
      </footer>
    </PageContainer>
  );
}
