import React from "react";
import { View, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { BluetoothDevice } from "@/context/BluetoothContext";

interface DeviceCardProps {
  device: BluetoothDevice;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting?: boolean;
}

export function DeviceCard({
  device,
  onConnect,
  onDisconnect,
  isConnecting = false,
}: DeviceCardProps) {
  const getSignalStrength = (rssi?: number): { icon: string; color: string } => {
    if (!rssi) return { icon: "wifi", color: Colors.dark.textSecondary };
    if (rssi > -50) return { icon: "wifi", color: Colors.dark.success };
    if (rssi > -70) return { icon: "wifi", color: Colors.dark.warning };
    return { icon: "wifi", color: Colors.dark.error };
  };

  const signal = getSignalStrength(device.rssi);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        device.isConnected && styles.connected,
        pressed && styles.pressed,
      ]}
      onPress={device.isConnected ? onDisconnect : onConnect}
    >
      <View style={styles.iconContainer}>
        <Feather
          name="bluetooth"
          size={24}
          color={device.isConnected ? Colors.dark.accent : Colors.dark.textSecondary}
        />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.deviceName}>{device.name}</ThemedText>
        <View style={styles.statusRow}>
          <Feather name={signal.icon as any} size={12} color={signal.color} />
          <ThemedText style={styles.statusText}>
            {device.isConnected ? "Bağlı" : "Bağlı Değil"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {isConnecting ? (
          <ActivityIndicator size="small" color={Colors.dark.accent} />
        ) : (
          <Feather
            name={device.isConnected ? "x-circle" : "chevron-right"}
            size={20}
            color={device.isConnected ? Colors.dark.error : Colors.dark.textSecondary}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
  },
  connected: {
    borderWidth: 1,
    borderColor: Colors.dark.accent,
  },
  pressed: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  actionContainer: {
    width: 32,
    alignItems: "center",
  },
});
