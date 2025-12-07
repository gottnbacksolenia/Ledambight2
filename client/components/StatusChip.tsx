import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";

interface StatusChipProps {
  isConnected: boolean;
  deviceName?: string;
}

export function StatusChip({ isConnected, deviceName }: StatusChipProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isConnected ? "rgba(0,230,118,0.15)" : "rgba(255,61,113,0.15)" },
      ]}
    >
      <Feather
        name={isConnected ? "bluetooth" : "bluetooth"}
        size={16}
        color={isConnected ? Colors.dark.success : Colors.dark.error}
      />
      <ThemedText
        style={[
          styles.text,
          { color: isConnected ? Colors.dark.success : Colors.dark.error },
        ]}
      >
        {isConnected ? deviceName || "Bağlı" : "Bağlı Değil"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
