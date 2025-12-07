
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi?: number;
  isConnected: boolean;
}

interface BluetoothContextType {
  devices: BluetoothDevice[];
  connectedDevice: BluetoothDevice | null;
  isScanning: boolean;
  isBluetoothEnabled: boolean;
  startScan: () => void;
  stopScan: () => void;
  connectDevice: (device: BluetoothDevice) => Promise<void>;
  disconnectDevice: () => void;
  sendColor: (color: string) => void;
  sendRegionColors: (colors: { top: string; right: string; bottom: string; left: string }) => void;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined);

// BLE Manager instance
const bleManager = Platform.OS !== "web" ? new BleManager() : null;

// LED Strip için özel UUID'ler - kendi cihazınıza göre güncelleyin
const SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb"; // Örnek UUID
const CHARACTERISTIC_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb"; // Örnek UUID

export function BluetoothProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(true);
  const [connectedBleDevice, setConnectedBleDevice] = useState<Device | null>(null);

  // Bluetooth durumunu kontrol et
  useEffect(() => {
    if (!bleManager) return;

    const subscription = bleManager.onStateChange((state) => {
      setIsBluetoothEnabled(state === State.PoweredOn);
      if (state === State.PoweredOn) {
        console.log("Bluetooth enabled");
      }
    }, true);

    return () => subscription.remove();
  }, []);

  // Android için Bluetooth izinlerini iste
  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android" && Platform.Version >= 31) {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      
      return (
        permissions["android.permission.BLUETOOTH_SCAN"] === PermissionsAndroid.RESULTS.GRANTED &&
        permissions["android.permission.BLUETOOTH_CONNECT"] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const startScan = useCallback(async () => {
    if (Platform.OS === "web") {
      // Web için mock data
      setIsScanning(true);
      setTimeout(() => {
        setDevices([
          { id: "mock-1", name: "LED Strip Living Room", rssi: -45, isConnected: false },
          { id: "mock-2", name: "LED Strip Bedroom", rssi: -62, isConnected: false },
          { id: "mock-3", name: "RGB Controller", rssi: -78, isConnected: false },
        ]);
        setIsScanning(false);
      }, 2000);
      return;
    }

    if (!bleManager) return;

    // İzinleri kontrol et
    const hasPermissions = await requestBluetoothPermissions();
    if (!hasPermissions) {
      console.log("Bluetooth permissions not granted");
      return;
    }

    setIsScanning(true);
    setDevices([]);

    // Önceki taramayı durdur
    bleManager.stopDeviceScan();

    // Yeni tarama başlat
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan error:", error);
        setIsScanning(false);
        return;
      }

      if (device && device.name) {
        // Sadece isimli cihazları göster
        setDevices((prev) => {
          const exists = prev.find((d) => d.id === device.id);
          if (exists) return prev;
          
          return [
            ...prev,
            {
              id: device.id,
              name: device.name || "Unknown Device",
              rssi: device.rssi || undefined,
              isConnected: false,
            },
          ];
        });
      }
    });

    // 10 saniye sonra taramayı durdur
    setTimeout(() => {
      stopScan();
    }, 10000);
  }, []);

  const stopScan = useCallback(() => {
    if (bleManager) {
      bleManager.stopDeviceScan();
    }
    setIsScanning(false);
  }, []);

  const connectDevice = useCallback(async (device: BluetoothDevice) => {
    if (Platform.OS === "web") {
      // Web için mock bağlantı
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const updatedDevice = { ...device, isConnected: true };
      setConnectedDevice(updatedDevice);
      setDevices((prev) =>
        prev.map((d) => (d.id === device.id ? updatedDevice : { ...d, isConnected: false }))
      );
      return;
    }

    if (!bleManager) return;

    try {
      console.log(`Connecting to ${device.name}...`);
      
      // Cihaza bağlan
      const connectedDevice = await bleManager.connectToDevice(device.id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      
      console.log(`Connected to ${device.name}`);
      
      setConnectedBleDevice(connectedDevice);
      const updatedDevice = { ...device, isConnected: true };
      setConnectedDevice(updatedDevice);
      setDevices((prev) =>
        prev.map((d) => (d.id === device.id ? updatedDevice : { ...d, isConnected: false }))
      );

      // Bağlantı kopması durumunu izle
      connectedDevice.onDisconnected(() => {
        console.log(`Disconnected from ${device.name}`);
        setConnectedDevice(null);
        setConnectedBleDevice(null);
        setDevices((prev) =>
          prev.map((d) => (d.id === device.id ? { ...d, isConnected: false } : d))
        );
      });
    } catch (error) {
      console.error("Connection error:", error);
    }
  }, []);

  const disconnectDevice = useCallback(async () => {
    if (connectedBleDevice && bleManager) {
      try {
        await bleManager.cancelDeviceConnection(connectedBleDevice.id);
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    }
    
    if (connectedDevice) {
      setDevices((prev) =>
        prev.map((d) => (d.id === connectedDevice.id ? { ...d, isConnected: false } : d))
      );
      setConnectedDevice(null);
      setConnectedBleDevice(null);
    }
  }, [connectedDevice, connectedBleDevice]);

  // RGB rengini byte array'e çevir
  const hexToRgbBytes = (hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ];
  };

  const sendColor = useCallback(async (color: string) => {
    if (!connectedDevice) return;
    
    if (Platform.OS === "web" || !connectedBleDevice || !bleManager) {
      console.log(`Sending color ${color} to ${connectedDevice.name}`);
      return;
    }

    try {
      const [r, g, b] = hexToRgbBytes(color);
      
      // Base64 encode RGB values
      const data = Buffer.from([r, g, b]).toString('base64');
      
      await connectedBleDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        data
      );
      
      console.log(`Sent color RGB(${r}, ${g}, ${b}) to ${connectedDevice.name}`);
    } catch (error) {
      console.error("Error sending color:", error);
    }
  }, [connectedDevice, connectedBleDevice]);

  const sendRegionColors = useCallback(
    async (colors: { top: string; right: string; bottom: string; left: string }) => {
      if (!connectedDevice) return;
      
      if (Platform.OS === "web" || !connectedBleDevice || !bleManager) {
        console.log(`Sending region colors to ${connectedDevice.name}:`, colors);
        return;
      }

      try {
        // Her bölge için renk gönder
        const regions = [colors.top, colors.right, colors.bottom, colors.left];
        
        for (let i = 0; i < regions.length; i++) {
          const [r, g, b] = hexToRgbBytes(regions[i]);
          
          // Bölge bilgisi + RGB değerleri (region index: 0-3)
          const data = Buffer.from([i, r, g, b]).toString('base64');
          
          await connectedBleDevice.writeCharacteristicWithResponseForService(
            SERVICE_UUID,
            CHARACTERISTIC_UUID,
            data
          );
          
          // Cihazın işlemesi için kısa bir bekleme
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        console.log(`Sent region colors to ${connectedDevice.name}`);
      } catch (error) {
        console.error("Error sending region colors:", error);
      }
    },
    [connectedDevice, connectedBleDevice]
  );

  return (
    <BluetoothContext.Provider
      value={{
        devices,
        connectedDevice,
        isScanning,
        isBluetoothEnabled,
        startScan,
        stopScan,
        connectDevice,
        disconnectDevice,
        sendColor,
        sendRegionColors,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
}

export function useBluetooth() {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error("useBluetooth must be used within a BluetoothProvider");
  }
  return context;
}
