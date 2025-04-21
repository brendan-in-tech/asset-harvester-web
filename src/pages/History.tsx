
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageContainer } from "@/components/ui/page-container";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { HistoryEntry } from "@/types/asset-types";
import { getHistory, clearHistory } from "@/utils/storage";

export default function History() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Handle clear history
  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    toast({
      title: "History Cleared",
      description: "Your scan history has been cleared",
      variant: "default"
    });
  };

  // Handle scan again
  const handleScanAgain = (url: string) => {
    // Navigate to main page with URL
    navigate("/?url=" + encodeURIComponent(url));
  };

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  // Extract domain from URL
  const extractDomain = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  };

  return (
    <PageContainer>
      <Header />
      
      <div className="mt-10 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Clock className="mr-3 h-8 w-8 text-harvester-400" />
            Scan History
          </h1>
          
          {history.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearHistory}
              className="text-red-400 border-red-900/50 hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="bg-harvester-900/30 rounded-lg border border-harvester-800">
            <table className="w-full">
              <thead className="bg-harvester-800/50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-harvester-300 uppercase tracking-wider">Website</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-harvester-300 uppercase tracking-wider">URL</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-harvester-300 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-harvester-300 uppercase tracking-wider">Assets</th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-harvester-300 uppercase tracking-wider">Downloads</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-harvester-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-harvester-800">
                {history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-harvester-800/30">
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{extractDomain(entry.url)}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-harvester-300 truncate max-w-xs" title={entry.url}>
                        {entry.url}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-harvester-300">{formatDate(entry.timestamp)}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm font-medium text-harvester-100">{entry.assetCount}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm text-harvester-300">{entry.downloadCount}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-harvester-400 hover:text-harvester-300 hover:bg-harvester-800/50"
                        onClick={() => handleScanAgain(entry.url)}
                      >
                        <Search className="h-4 w-4 mr-1" />
                        Scan Again
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-harvester-900/30 rounded-lg p-12 text-center border border-harvester-800">
            <div className="text-5xl text-harvester-600 mb-4">
              <Clock />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No History Yet</h3>
            <p className="text-harvester-300 mb-6">
              Your scan history will appear here once you start scanning websites.
            </p>
            <Button onClick={() => navigate("/")} className="bg-harvester-600 hover:bg-harvester-500">
              <Search className="h-4 w-4 mr-1" />
              Scan a Website
            </Button>
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
