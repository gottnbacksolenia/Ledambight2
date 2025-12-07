export interface CropCorners {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

export interface AppSettings {
  sensitivity: number;
  updateRate: number;
  brightness: boolean;
  cameraFacing: "front" | "back";
  cropCorners: CropCorners | null;
  isCalibrated: boolean;
}

export interface SavedDevice {
  id: string;
  name: string;
  lastConnected?: string;
}

export const defaultCropCorners: CropCorners = {
  topLeft: { x: 0.1, y: 0.1 },
  topRight: { x: 0.9, y: 0.1 },
  bottomLeft: { x: 0.1, y: 0.9 },
  bottomRight: { x: 0.9, y: 0.9 },
};

export const defaultSettings: AppSettings = {
  sensitivity: 5,
  updateRate: 30,
  brightness: true,
  cameraFacing: "back",
  cropCorners: null,
  isCalibrated: false,
};

let inMemorySettings: AppSettings = { ...defaultSettings };
let inMemoryDevices: SavedDevice[] = [];

export async function getSettings(): Promise<AppSettings> {
  return inMemorySettings;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  inMemorySettings = { ...settings };
}

export async function getSavedDevices(): Promise<SavedDevice[]> {
  return inMemoryDevices;
}

export async function saveDevice(device: SavedDevice): Promise<void> {
  const existingIndex = inMemoryDevices.findIndex((d) => d.id === device.id);
  if (existingIndex >= 0) {
    inMemoryDevices[existingIndex] = device;
  } else {
    inMemoryDevices.push(device);
  }
}

export async function removeDevice(deviceId: string): Promise<void> {
  inMemoryDevices = inMemoryDevices.filter((d) => d.id !== deviceId);
}
