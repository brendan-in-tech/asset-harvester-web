
import { useState } from "react";
import { HistoryEntry } from "@/types/asset-types";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCcw, Trash2 } from "lucide-react";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (url: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Format date from timestamp
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Extract domain from URL
  const extractDomain = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (e) {
      return url;
    }
  };

  if (history.length === 0) return null;

  return (
    <div className="mt-6 w-full">
      <Button
        variant="outline"
        className="text-harvester-300 border-harvester-700 hover:bg-harvester-800 w-full flex justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Recent scans ({history.length})
        </span>
        <svg
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </svg>
      </Button>
      
      {isOpen && (
        <div className="mt-2 bg-harvester-900/30 border border-harvester-800 rounded-lg overflow-hidden">
          <div className="max-h-72 overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-harvester-800/50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-harvester-300 uppercase tracking-wider">Website</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-harvester-300 uppercase tracking-wider">Scanned</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-harvester-300 uppercase tracking-wider">Assets</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-harvester-300 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-harvester-800">
                {history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-harvester-800/30">
                    <td className="py-3 px-4 text-sm text-harvester-200">{extractDomain(entry.url)}</td>
                    <td className="py-3 px-4 text-sm text-harvester-300">{formatDate(entry.timestamp)}</td>
                    <td className="py-3 px-4 text-sm text-harvester-300">{entry.assetCount}</td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-harvester-400 hover:text-harvester-300"
                        onClick={() => onSelect(entry.url)}
                      >
                        <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                        Scan Again
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-3 bg-harvester-900/50 border-t border-harvester-800 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
              onClick={onClear}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear History
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
