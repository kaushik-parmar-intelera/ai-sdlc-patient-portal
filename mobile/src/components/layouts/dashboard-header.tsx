import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { colors, radii, shadows, spacing, typography } from "../../theme";

type DashboardHeaderProps = {
  eyebrow: string;
  subtitle: string;
  title: string;
};

export function DashboardHeader({ eyebrow, subtitle, title }: DashboardHeaderProps) {
  return (
    <LinearGradient colors={[colors.deepTeal, colors.teal]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{eyebrow}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.overlay,
    borderRadius: radii.pill,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: colors.cream,
    fontSize: typography.overline.fontSize,
    fontWeight: typography.overline.fontWeight,
    letterSpacing: typography.overline.letterSpacing,
    textTransform: "uppercase",
  },
  title: {
    color: colors.cream,
    fontSize: typography.display.fontSize,
    fontWeight: typography.display.fontWeight,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.creamMuted,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
});
