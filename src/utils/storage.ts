import { HistoryEntry } from "@/types/asset-types";

const HISTORY_KEY = "asset-harvester-history";
const MAX_HISTORY_ITEMS = 10;

// Get scan history from localStorage
export const getHistory = (): HistoryEntry[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (!storedHistory) return [];
    
    return JSON.parse(storedHistory);
  } catch (error) {
    console.error("Failed to parse history from localStorage:", error);
    return [];
  }
};

// Add scan to history
export const addToHistory = (entry: HistoryEntry): void => {
  try {
    const history = getHistory();
    
    // Check if URL already exists in history
    const existingIndex = history.findIndex(item => item.url === entry.url);
    if (existingIndex !== -1) {
      // Update existing entry
      history[existingIndex] = entry;
    } else {
      // Add new entry, keep list to max size
      history.unshift(entry);
      if (history.length > MAX_HISTORY_ITEMS) {
        history.pop();
      }
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history to localStorage:", error);
  }
};

// Clear history
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history from localStorage:", error);
  }
};
