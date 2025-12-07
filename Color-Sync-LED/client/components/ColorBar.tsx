import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { BorderRadius, Spacing } from "@/constants/theme";

interface ColorBarProps {
  colors: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  isActive: boolean;
}

export function ColorBar({ colors, isActive }: ColorBarProps) {
  const topStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(colors.top, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  }));

  const rightStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(colors.right, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  }));

  const bottomStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(colors.bottom, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  }));

  const leftStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(colors.left, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }),
  }));

  if (!isActive) {
    return (
      <View style={styles.container}>
        <View style={[styles.colorSegment, styles.inactive]} />
        <View style={[styles.colorSegment, styles.inactive]} />
        <View style={[styles.colorSegment, styles.inactive]} />
        <View style={[styles.colorSegment, styles.inactive]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.colorSegment, leftStyle]} />
      <Animated.View style={[styles.colorSegment, topStyle]} />
      <Animated.View style={[styles.colorSegment, bottomStyle]} />
      <Animated.View style={[styles.colorSegment, rightStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    height: 8,
  },
  colorSegment: {
    flex: 1,
    height: 8,
    borderRadius: BorderRadius.xs,
  },
  inactive: {
    backgroundColor: "#2A3340",
  },
});
