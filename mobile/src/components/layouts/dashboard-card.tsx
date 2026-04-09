import { StyleSheet, Text, View } from "react-native";

import { colors, radii, shadows, spacing, typography } from "../../theme";

type DashboardCardProps = {
  caption: string;
  label: string;
  tone: "teal" | "gold" | "coral";
  value: string;
};

const toneMap = {
  teal: colors.mint,
  gold: colors.gold,
  coral: colors.coral,
};

export function DashboardCard({ caption, label, tone, value }: DashboardCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.toneMarker, { backgroundColor: toneMap[tone] }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    flexBasis: "47%",
    minWidth: 150,
    padding: spacing.lg,
    ...shadows.card,
  },
  toneMarker: {
    borderRadius: radii.pill,
    height: 6,
    marginBottom: spacing.md,
    width: 48,
  },
  label: {
    color: colors.muted,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  value: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  caption: {
    color: colors.muted,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
});
