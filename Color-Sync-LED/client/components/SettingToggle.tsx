import React from "react";
import { View, Switch, StyleSheet, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants/theme";

interface SettingToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingToggle({
  label,
  description,
  value,
  onValueChange,
}: SettingToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        {description ? (
          <ThemedText style={styles.description}>{description}</ThemedText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: Colors.dark.backgroundTertiary,
          true: Colors.dark.accent,
        }}
        thumbColor={Platform.OS === "android" ? Colors.dark.text : undefined}
        ios_backgroundColor={Colors.dark.backgroundTertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.backgroundSecondary,
  },
  content: {
    flex: 1,
    marginRight: Spacing.md,
  },
  label: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  description: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
});
