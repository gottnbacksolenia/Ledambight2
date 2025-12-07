import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";

interface EmptyDevicesProps {
  onScan: () => void;
  isScanning: boolean;
}

export function EmptyDevices({ onScan, isScanning }: EmptyDevicesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Feather name="wifi" size={48} color={Colors.dark.accent} />
        <View style={styles.waves}>
          <View style={[styles.wave, styles.wave1]} />
          <View style={[styles.wave, styles.wave2]} />
          <View style={[styles.wave, styles.wave3]} />
        </View>
      </View>

      <ThemedText style={styles.title}>Cihaz Bulunamadı</ThemedText>
      <ThemedText style={styles.description}>
        Aynı WiFi ağındaki ESP LED cihazlarını bulmak için taramayı başlatın.
      </ThemedText>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => {
          console.log('Tarama butonu tıklandı');
          onScan();
        }}
        disabled={isScanning}
      >
        <Feather name="search" size={20} color={Colors.dark.buttonText} />
        <ThemedText style={styles.buttonText}>
          {isScanning ? "Taranıyor..." : "Tarama Başlat"}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["3xl"],
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  waves: {
    position: "absolute",
    width: 120,
    height: 120,
  },
  wave: {
    position: "absolute",
    borderWidth: 2,
    borderColor: Colors.dark.accent,
    borderRadius: 60,
    opacity: 0.2,
  },
  wave1: {
    width: 80,
    height: 80,
    top: 20,
    left: 20,
  },
  wave2: {
    width: 100,
    height: 100,
    top: 10,
    left: 10,
    opacity: 0.15,
  },
  wave3: {
    width: 120,
    height: 120,
    top: 0,
    left: 0,
    opacity: 0.1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.buttonText,
  },
});
