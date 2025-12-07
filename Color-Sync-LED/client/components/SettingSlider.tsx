import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import Slider from "@react-native-community/slider";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants/theme";

interface SettingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onValueChange: (value: number) => void;
}

export function SettingSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onValueChange,
}: SettingSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <ThemedText style={styles.value}>
          {Math.round(value)}
          {unit}
        </ThemedText>
      </View>
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onValueChange}
        minimumTrackTintColor={Colors.dark.accent}
        maximumTrackTintColor={Colors.dark.backgroundTertiary}
        thumbTintColor={Platform.OS === "android" ? Colors.dark.accent : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.accent,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
