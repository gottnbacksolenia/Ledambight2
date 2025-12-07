import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants/theme";

interface SettingRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
}

export function SettingRow({
  label,
  value,
  onPress,
  showArrow = true,
}: SettingRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
      disabled={!onPress}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={styles.right}>
        {value ? <ThemedText style={styles.value}>{value}</ThemedText> : null}
        {showArrow && onPress ? (
          <Feather name="chevron-right" size={20} color={Colors.dark.textSecondary} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.backgroundSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  value: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
});
