import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../../theme";

type DashboardHeaderProps = {
  subtitle: string;
  title: string;
  onNotifications?: () => void;
};

export function DashboardHeader({ subtitle, title }: DashboardHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.trustBadge}>
        <MaterialIcons color={colors.onSurfaceVariant} name="lock" size={14} />
        <Text style={styles.trustText}>End-to-End Encrypted</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  trustBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 99,
    flexDirection: "row",
    gap: 6,
    marginBottom: spacing.md,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  trustText: {
    color: colors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: colors.onSurface,
    fontSize: typography.display.fontSize,
    fontWeight: typography.display.fontWeight,
    letterSpacing: typography.display.letterSpacing,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    fontSize: typography.body.fontSize,
    opacity: 0.8,
  },
});
