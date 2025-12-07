import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SectionHeader } from "@/components/SectionHeader";
import { SettingSlider } from "@/components/SettingSlider";
import { SettingToggle } from "@/components/SettingToggle";
import { SettingRow } from "@/components/SettingRow";
import { useSettings } from "@/context/SettingsContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

export default function SettingsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { settings, updateSettings, resetCalibration, isLoading } = useSettings();

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: Colors.dark.backgroundRoot }]}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Yükleniyor...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const toggleCameraFacing = () => {
    updateSettings({
      cameraFacing: settings.cameraFacing === "back" ? "front" : "back",
    });
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors.dark.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        scrollIndicatorInsets={{ bottom: tabBarHeight }}
      >
        <SectionHeader title="Renk Algılama" />
        <View style={styles.section}>
          <SettingSlider
            label="Hassasiyet"
            value={settings.sensitivity}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => updateSettings({ sensitivity: value })}
          />

          <SettingSlider
            label="Güncelleme Hızı"
            value={settings.updateRate}
            min={10}
            max={60}
            step={5}
            unit=" FPS"
            onValueChange={(value) => updateSettings({ updateRate: value })}
          />

          <SettingToggle
            label="Parlaklık Ayarı"
            description="Ortam ışığına göre parlaklığı otomatik ayarla"
            value={settings.brightness}
            onValueChange={(value) => updateSettings({ brightness: value })}
          />
        </View>

        <SectionHeader title="Kamera" />
        <View style={styles.section}>
          <SettingRow
            label="Kamera Yönü"
            value={settings.cameraFacing === "back" ? "Arka" : "Ön"}
            onPress={toggleCameraFacing}
          />
        </View>

        <SectionHeader title="Kalibrasyon" />
        <View style={styles.section}>
          <SettingRow
            label="TV Alanı Kalibrasyonu"
            value={settings.isCalibrated ? "Kalibre edildi" : "Kalibre edilmedi"}
            showArrow={false}
          />
          {settings.isCalibrated ? (
            <Pressable
              style={({ pressed }) => [styles.resetButton, pressed && styles.resetButtonPressed]}
              onPress={resetCalibration}
            >
              <Feather name="refresh-cw" size={16} color={Colors.dark.error} />
              <ThemedText style={styles.resetButtonText}>Kalibrasyonu Sıfırla</ThemedText>
            </Pressable>
          ) : null}
        </View>

        <SectionHeader title="Hakkında" />
        <View style={styles.section}>
          <SettingRow
            label="Uygulama Sürümü"
            value="1.0.0"
            showArrow={false}
          />

          <SettingRow
            label="Nasıl Kullanılır"
            onPress={() => {}}
          />

          <SettingRow
            label="Destek"
            onPress={() => {}}
          />
        </View>

        <View style={styles.infoCard}>
          <Feather name="info" size={20} color={Colors.dark.accent} />
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoTitle}>Nasıl Çalışır?</ThemedText>
            <ThemedText style={styles.infoDescription}>
              Telefonunuzun kamerasını TV veya monitörünüze doğru tutun. Uygulama
              ekrandaki renkleri algılayıp bağlı LED cihazınıza gönderir.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  section: {
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: Colors.dark.backgroundDefault,
    borderRadius: BorderRadius.sm,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.dark.error,
  },
  resetButtonPressed: {
    opacity: 0.7,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark.error,
  },
});
