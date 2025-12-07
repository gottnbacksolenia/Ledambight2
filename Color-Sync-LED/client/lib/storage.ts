import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "@ambilight_settings";
const DEVICES_KEY = "@ambilight_devices";

export interface AppSettings {
  sensitivity: number;
  updateRate: number;
  brightness: boolean;
  cameraFacing: "front" | "back";
}

export interface SavedDevice {
  id: string;
  name: string;
  lastConnected?: string;
}

export const defaultSettings: AppSettings = {
  sensitivity: 5,
  updateRate: 30,
  brightness: true,
  cameraFacing: "back",
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
    return defaultSettings;
  } catch (error) {
    console.error("Error loading settings:", error);
    return defaultSettings;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

export async function getSavedDevices(): Promise<SavedDevice[]> {
  try {
    const stored = await AsyncStorage.getItem(DEVICES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error("Error loading devices:", error);
    return [];
  }
}

export async function saveDevice(device: SavedDevice): Promise<void> {
  try {
    const devices = await getSavedDevices();
    const existingIndex = devices.findIndex((d) => d.id === device.id);
    if (existingIndex >= 0) {
      devices[existingIndex] = device;
    } else {
      devices.push(device);
    }
    await AsyncStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
  } catch (error) {
    console.error("Error saving device:", error);
  }
}

export async function removeDevice(deviceId: string): Promise<void> {
  try {
    const devices = await getSavedDevices();
    const filtered = devices.filter((d) => d.id !== deviceId);
    await AsyncStorage.setItem(DEVICES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error removing device:", error);
  }
}
