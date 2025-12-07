
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import dgram from 'react-native-udp';
import WifiManager from "react-native-wifi-reborn";

export interface WiFiDevice {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  rssi?: number;
  isConnected: boolean;
}

interface WiFiContextType {
  devices: WiFiDevice[];
  connectedDevice: WiFiDevice | null;
  isScanning: boolean;
  isWiFiEnabled: boolean;
  startScan: () => void;
  stopScan: () => void;
  connectDevice: (device: WiFiDevice) => Promise<void>;
  disconnectDevice: () => void;
  sendColor: (color: string) => void;
  sendRegionColors: (colors: { top: string; right: string; bottom: string; left: string }) => void;
}

const WiFiContext = createContext<WiFiContextType | undefined>(undefined);

// ESP cihazları için standart UDP portu
const ESP_UDP_PORT = 7777;
const BROADCAST_PORT = 7778;

export function WiFiProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<WiFiDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<WiFiDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isWiFiEnabled, setIsWiFiEnabled] = useState(true);
  const [udpSocket, setUdpSocket] = useState<any>(null);

  useEffect(() => {
    // WiFi durumunu kontrol et
    checkWiFiStatus();
  }, []);

  const checkWiFiStatus = async () => {
    if (Platform.OS === "web") {
      setIsWiFiEnabled(true);
      return;
    }

    try {
      const isEnabled = await WifiManager.isEnabled();
      setIsWiFiEnabled(isEnabled);
    } catch (error) {
      console.error("WiFi status check error:", error);
      setIsWiFiEnabled(false);
    }
  };

  // Android için WiFi izinlerini iste
  const requestWiFiPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const permissions = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        
        return (
          permissions["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED &&
          permissions["android.permission.ACCESS_COARSE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error("Permission error:", error);
        return false;
      }
    }
    return true;
  };

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

  const startScan = useCallback(async () => {
    console.log('startScan çağrıldı');
    
    // İzinleri kontrol et
    const hasPermissions = await requestWiFiPermissions();
    if (!hasPermissions) {
      console.log("WiFi permissions not granted");
      return;
    }

    setIsScanning(true);
    setDevices([]); // Önceki cihazları temizle

    try {
      console.log('Gerçek WiFi taraması başlatılıyor...');
      
      // ESP cihazlarını bulmak için UDP broadcast kullan
      const socket = dgram.createSocket('udp4');
      
      socket.bind(BROADCAST_PORT, () => {
        socket.setBroadcast(true);
        console.log(`UDP socket ${BROADCAST_PORT} portunda dinlemeye başladı`);
        
        // Her 3 saniyede bir discovery mesajı gönder (gerçek zamanlı tarama)
        const sendDiscovery = () => {
          const discoveryMessage = Buffer.from('ESP_LED_DISCOVERY');
          socket.send(
            discoveryMessage,
            0,
            discoveryMessage.length,
            BROADCAST_PORT,
            '255.255.255.255',
            (err) => {
              if (err) console.error('Broadcast error:', err);
              else console.log('Discovery broadcast mesajı gönderildi');
            }
          );
        };

        // İlk mesajı hemen gönder
        sendDiscovery();
        
        // Her 3 saniyede bir tekrar gönder
        const interval = setInterval(sendDiscovery, 3000);
        
        // 30 saniye sonra taramayı durdur
        setTimeout(() => {
          clearInterval(interval);
          socket.close();
          setIsScanning(false);
          console.log('WiFi taraması tamamlandı');
        }, 30000);
      });

      // ESP cihazlarından gelen yanıtları dinle
      socket.on('message', (msg: Buffer, rinfo: any) => {
        try {
          const response = JSON.parse(msg.toString());
          console.log('Cihaz yanıtı alındı:', response);
          
          if (response.type === 'ESP_LED_DEVICE') {
            const newDevice: WiFiDevice = {
              id: response.id || rinfo.address,
              name: response.name || `ESP LED (${rinfo.address})`,
              ipAddress: rinfo.address,
              port: response.port || ESP_UDP_PORT,
              rssi: response.rssi,
              isConnected: false,
            };

            setDevices((prev) => {
              // Cihazı güncelle veya ekle
              const existingIndex = prev.findIndex((d) => d.ipAddress === newDevice.ipAddress);
              if (existingIndex >= 0) {
                // Mevcut cihazı güncelle (RSSI değişmiş olabilir)
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], rssi: newDevice.rssi };
                return updated;
              } else {
                console.log('Yeni cihaz eklendi:', newDevice.name);
                return [...prev, newDevice];
              }
            });
          }
        } catch (error) {
          console.error('Error parsing device response:', error);
        }
      });

      socket.on('error', (err: Error) => {
        console.error('UDP Socket error:', err);
      });

    } catch (error) {
      console.error('WiFi scan error:', error);
      setIsScanning(false);
    }
  }, []);

  const stopScan = useCallback(() => {
    setIsScanning(false);
  }, []);

  const connectDevice = useCallback(async (device: WiFiDevice) => {
    try {
      console.log(`ESP cihazına bağlanılıyor: ${device.name} (${device.ipAddress}:${device.port})`);
      
      // UDP socket oluştur
      const socket = dgram.createSocket('udp4');
      
      socket.bind(() => {
        console.log(`Bağlantı kuruldu: ${device.name}`);
        
        setUdpSocket(socket);
        const updatedDevice = { ...device, isConnected: true };
        setConnectedDevice(updatedDevice);
        setDevices((prev) =>
          prev.map((d) => (d.id === device.id ? updatedDevice : { ...d, isConnected: false }))
        );
      });

      socket.on('error', (err: Error) => {
        console.error('UDP Socket hatası:', err);
        disconnectDevice();
      });

    } catch (error) {
      console.error("Bağlantı hatası:", error);
    }
  }, []);

  const disconnectDevice = useCallback(() => {
    if (udpSocket) {
      try {
        udpSocket.close();
        setUdpSocket(null);
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    }
    
    if (connectedDevice) {
      setDevices((prev) =>
        prev.map((d) => (d.id === connectedDevice.id ? { ...d, isConnected: false } : d))
      );
      setConnectedDevice(null);
    }
  }, [connectedDevice, udpSocket]);

  const sendColor = useCallback((color: string) => {
    if (!connectedDevice || !udpSocket) {
      console.log('Bağlı cihaz yok veya socket açık değil');
      return;
    }

    try {
      const [r, g, b] = hexToRgbBytes(color);
      
      // UDP paketi: [CMD_TYPE(1), R(1), G(1), B(1)]
      // CMD_TYPE: 0 = single color
      const packet = Buffer.from([0, r, g, b]);
      
      udpSocket.send(
        packet,
        0,
        packet.length,
        connectedDevice.port,
        connectedDevice.ipAddress,
        (err: Error) => {
          if (err) {
            console.error('Renk gönderme hatası:', err);
          } else {
            console.log(`Renk gönderildi RGB(${r}, ${g}, ${b}) -> ${connectedDevice.name}`);
          }
        }
      );
    } catch (error) {
      console.error("Renk gönderme hatası:", error);
    }
  }, [connectedDevice, udpSocket]);

  const sendRegionColors = useCallback(
    (colors: { top: string; right: string; bottom: string; left: string }) => {
      if (!connectedDevice || !udpSocket) {
        console.log('Bağlı cihaz yok veya socket açık değil');
        return;
      }

      try {
        // Her bölge için renk al
        const regions = [colors.top, colors.right, colors.bottom, colors.left];
        const rgbValues: number[] = [];
        
        for (const color of regions) {
          rgbValues.push(...hexToRgbBytes(color));
        }
        
        // UDP paketi: [CMD_TYPE(1), TOP_R, TOP_G, TOP_B, RIGHT_R, RIGHT_G, RIGHT_B, BOTTOM_R, BOTTOM_G, BOTTOM_B, LEFT_R, LEFT_G, LEFT_B]
        // CMD_TYPE: 1 = region colors (total 13 bytes)
        const packet = Buffer.from([1, ...rgbValues]);
        
        udpSocket.send(
          packet,
          0,
          packet.length,
          connectedDevice.port,
          connectedDevice.ipAddress,
          (err: Error) => {
            if (err) {
              console.error('Bölge renkleri gönderme hatası:', err);
            } else {
              console.log(`Bölge renkleri gönderildi -> ${connectedDevice.name}`);
            }
          }
        );
      } catch (error) {
        console.error("Bölge renkleri gönderme hatası:", error);
      }
    },
    [connectedDevice, udpSocket]
  );

  return (
    <WiFiContext.Provider
      value={{
        devices,
        connectedDevice,
        isScanning,
        isWiFiEnabled,
        startScan,
        stopScan,
        connectDevice,
        disconnectDevice,
        sendColor,
        sendRegionColors,
      }}
    >
      {children}
    </WiFiContext.Provider>
  );
}

export function useWiFi() {
  const context = useContext(WiFiContext);
  if (!context) {
    throw new Error("useWiFi must be used within a WiFiProvider");
  }
  return context;
}
