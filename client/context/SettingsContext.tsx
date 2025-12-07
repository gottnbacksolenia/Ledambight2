import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppSettings, CropCorners, defaultSettings, getSettings, saveSettings } from "@/lib/storage";

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  saveCropCorners: (corners: CropCorners) => Promise<void>;
  resetCalibration: () => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const loaded = await getSettings();
      setSettings(loaded);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateSettings(newSettings: Partial<AppSettings>) {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettings(updated);
  }

  async function saveCropCorners(corners: CropCorners) {
    const updated = { 
      ...settings, 
      cropCorners: corners,
      isCalibrated: true 
    };
    setSettings(updated);
    await saveSettings(updated);
  }

  async function resetCalibration() {
    const updated = { 
      ...settings, 
      cropCorners: null,
      isCalibrated: false 
    };
    setSettings(updated);
    await saveSettings(updated);
  }

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSettings, 
      saveCropCorners,
      resetCalibration,
      isLoading 
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
