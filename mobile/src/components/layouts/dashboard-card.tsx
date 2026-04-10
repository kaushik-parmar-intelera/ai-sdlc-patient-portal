import { StyleSheet, Text, View } from "react-native";

import { colors, radii, shadows, spacing, typography } from "../../theme";

type DashboardCardProps = {
  caption: string;
  label: string;
  tone: "teal" | "gold" | "coral";
  value: string;
};

const toneAccent: Record<string, string> = {
  teal: "#A8D8C8",
  gold: colors.tertiaryContainer,
  coral: colors.errorContainer,
};

export function DashboardCard({ caption, label, tone, value }: DashboardCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: toneAccent[tone] }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    flexBasis: "47%",
    minWidth: 150,
    padding: spacing.lg,
    ...shadows.card,
  },
  accent: {
    borderRadius: radii.pill,
    height: 4,
    marginBottom: spacing.md,
    width: 40,
  },
  label: {
    color: colors.onSurfaceVariant,
    fontSize: typography.caption.fontSize,
    fontWeight: "500",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  value: {
    color: colors.onSurface,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  caption: {
    color: colors.onSurfaceVariant,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
});
