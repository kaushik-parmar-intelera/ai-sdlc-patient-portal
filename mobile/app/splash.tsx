import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "../src/components/forms/primary-button";
import { colors, radii, shadows, spacing, typography } from "../src/theme";

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.root}>
      {/* Background glow blob */}
      <View style={styles.glowBlob} />

      {/* Main content */}
      <View style={styles.content}>
        {/* App icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconGradient} />
          <MaterialIcons color={colors.primary} name="medical-services" size={64} />
          <View style={styles.verifiedBadge}>
            <MaterialIcons color={colors.primary} name="verified-user" size={14} />
          </View>
        </View>

        {/* Typography */}
        <View style={styles.textBlock}>
          <Text style={styles.headline}>Patient Portal</Text>
          <Text style={styles.subheadline}>Your health, in your hands.</Text>
        </View>

        {/* Vitals preview card */}
        <View style={styles.previewCard}>
          <View style={styles.previewIconBox}>
            <MaterialIcons color={colors.primary} name="favorite" size={24} />
          </View>
          <View style={styles.previewText}>
            <Text style={styles.previewTitle}>Daily Vitals</Text>
            <Text style={styles.previewSub}>Last synced 2m ago</Text>
          </View>
          <MaterialIcons color={colors.primaryContainer} name="arrow-forward-ios" size={16} />
        </View>
      </View>

      {/* Footer actions */}
      <View style={styles.footer}>
        <View style={styles.trustBadge}>
          <MaterialIcons color={colors.onSurfaceVariant} name="lock" size={14} />
          <Text style={styles.trustText}>End-to-End Encrypted</Text>
        </View>

        <PrimaryButton label="Create Account" onPress={() => router.push("/register")} />

        <View style={styles.gap} />

        <PrimaryButton
          label="Sign In"
          onPress={() => router.push("/login")}
          variant="secondary"
        />
      </View>

      {/* Home indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  glowBlob: {
    backgroundColor: `${colors.primaryFixedDim}33`,
    borderRadius: 999,
    height: 256,
    left: "50%",
    position: "absolute",
    top: "20%",
    transform: [{ translateX: -128 }, { translateY: -128 }],
    width: 256,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  iconWrapper: {
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 32,
    height: 128,
    justifyContent: "center",
    marginBottom: spacing.xxl,
    position: "relative",
    width: 128,
    ...shadows.float,
  },
  iconGradient: {
    backgroundColor: `${colors.primaryContainer}33`,
    borderRadius: 32,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  verifiedBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 99,
    bottom: 8,
    padding: 4,
    position: "absolute",
    right: 8,
    ...shadows.card,
  },
  textBlock: {
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  headline: {
    color: colors.onSurface,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subheadline: {
    color: colors.onSurfaceVariant,
    fontSize: 17,
    fontWeight: "500",
    maxWidth: 240,
    opacity: 0.8,
    textAlign: "center",
  },
  previewCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    width: "100%",
    ...shadows.card,
  },
  previewIconBox: {
    alignItems: "center",
    backgroundColor: colors.primaryFixed,
    borderRadius: 16,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  previewText: {
    flex: 1,
  },
  previewTitle: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: "700",
  },
  previewSub: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
  footer: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  trustBadge: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
    marginBottom: spacing.sm,
    opacity: 0.6,
  },
  trustText: {
    color: colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  gap: {
    height: 0,
  },
  homeIndicator: {
    alignSelf: "center",
    backgroundColor: `${colors.onSurface}1A`,
    borderRadius: 99,
    height: 6,
    marginBottom: 6,
    width: 128,
  },
});
