import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { DeviceCard } from "@/components/DeviceCard";
import { EmptyDevices } from "@/components/EmptyDevices";
import { SectionHeader } from "@/components/SectionHeader";
import { useWiFi } from "@/context/WiFiContext";
import { Colors, Spacing } from "@/constants/theme";

export default function DevicesScreen() {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const tabBarHeight = useBottomTabBarHeight();
  const {
    devices,
    connectedDevice,
    isScanning,
    startScan,
    connectDevice,
    disconnectDevice,
  } = useWiFi();

  useEffect(() => {
    // İlk taramayı başlat
    console.log('DevicesScreen mounted, başlangıç taraması yapılıyor...');
    const timer = setTimeout(() => {
      startScan();
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [startScan]);

  const handleConnect = async (device: typeof devices[0]) => {
    setConnectingId(device.id);
    try {
      await connectDevice(device);
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = () => {
    disconnectDevice();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    startScan();
    setTimeout(() => setRefreshing(false), 2000);
  };

  const connectedDevices = devices.filter((d) => d.isConnected);
  const availableDevices = devices.filter((d) => !d.isConnected);

  const hasDevices = devices.length > 0;

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors.dark.backgroundRoot }]}>
      {!hasDevices && !isScanning ? (
        <EmptyDevices onScan={startScan} isScanning={isScanning} />
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: tabBarHeight + Spacing.xl },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.dark.accent}
            />
          }
          scrollIndicatorInsets={{ bottom: tabBarHeight }}
        >
          {isScanning && devices.length === 0 && (
            <View style={styles.scanningContainer}>
              <ActivityIndicator size="large" color={Colors.dark.accent} />
              <ThemedText style={styles.scanningText}>
                WiFi ağı taranıyor...
              </ThemedText>
              <ThemedText style={[styles.scanningText, { fontSize: 12, marginTop: 8 }]}>
                ESP LED cihazları aranıyor
              </ThemedText>
            </View>
          )}

          {connectedDevices.length > 0 && (
            <>
              <SectionHeader title="Bağlı Cihaz" />
              {connectedDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onConnect={() => handleConnect(device)}
                  onDisconnect={handleDisconnect}
                  isConnecting={connectingId === device.id}
                />
              ))}
            </>
          )}

          {availableDevices.length > 0 && (
            <>
              <SectionHeader title="Mevcut Cihazlar" />
              {availableDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onConnect={() => handleConnect(device)}
                  onDisconnect={handleDisconnect}
                  isConnecting={connectingId === device.id}
                />
              ))}
            </>
          )}

          {isScanning && devices.length > 0 && (
            <View style={styles.scanningFooter}>
              <ActivityIndicator size="small" color={Colors.dark.accent} />
              <ThemedText style={styles.scanningFooterText}>
                Daha fazla cihaz aranıyor...
              </ThemedText>
            </View>
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  scanningContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
  },
  scanningText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: Spacing.lg,
  },
  scanningFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  scanningFooterText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
});
