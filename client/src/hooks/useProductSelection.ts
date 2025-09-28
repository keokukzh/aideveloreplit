import { useState, useEffect } from "react";

const STORAGE_KEY = "aidevelo-selected-modules";

export function useProductSelection() {
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(() => {
    // Load from localStorage on initial render
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persist to localStorage whenever selection changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedModuleIds));
    } catch (error) {
      console.warn("Failed to save product selection to localStorage:", error);
    }
  }, [selectedModuleIds]);

  const toggleModule = (moduleId: string, enabled: boolean) => {
    setSelectedModuleIds(prev => {
      if (enabled) {
        // Add module if not already selected
        return prev.includes(moduleId) ? prev : [...prev, moduleId];
      } else {
        // Remove module
        return prev.filter(id => id !== moduleId);
      }
    });
  };

  const isModuleSelected = (moduleId: string) => {
    return selectedModuleIds.includes(moduleId);
  };

  const clearSelection = () => {
    setSelectedModuleIds([]);
  };

  const selectAll = () => {
    setSelectedModuleIds(["phone", "chat", "social"]);
  };

  return {
    selectedModuleIds,
    toggleModule,
    isModuleSelected,
    clearSelection,
    selectAll,
    hasSelection: selectedModuleIds.length > 0
  };
}