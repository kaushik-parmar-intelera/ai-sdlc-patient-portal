import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "../src/components/layouts/bottom-nav";
import { DASHBOARD_ACTIONS, DASHBOARD_SUMMARY } from "../src/constants/dashboard";
import { getProtectedRedirectPath } from "../src/features/auth/route-guard";
import { useAuthStore } from "../src/store/auth-store";
import { colors, radii, shadows, spacing, typography } from "../src/theme";

export default function HomeScreen() {
  const account = useAuthStore((state) => state.account);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const redirectPath = getProtectedRedirectPath(isAuthenticated);
    if (redirectPath) router.replace(redirectPath);
  }, [isAuthenticated]);

  if (!isAuthenticated || !account) return null;

  const firstName = account.displayName.split(" ")[0];

  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      {/* Fixed header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Portal</Text>
        <Pressable hitSlop={8} style={styles.notifBtn}>
          <MaterialIcons color={colors.onSurface} name="notifications" size={24} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View style={styles.welcomeBlock}>
          <Text style={styles.welcomeTitle}>Good morning, {firstName}.</Text>
          <Text style={styles.welcomeSub}>Here's your health summary.</Text>
        </View>

        {/* Trust badge */}
        <View style={styles.trustBadge}>
          <MaterialIcons color={colors.onSurfaceVariant} name="lock" size={13} />
          <Text style={styles.trustText}>End-to-End Encrypted</Text>
        </View>

        {/* Appointment card */}
        <Pressable
          onPress={() => Alert.alert("Appointments", DASHBOARD_ACTIONS[0].placeholderMessage)}
          style={({ pressed }) => [styles.card, styles.cardAccentTeal, pressed && styles.cardPressed]}
        >
          <View style={styles.cardTopRow}>
            <View style={[styles.cardIconBox, { backgroundColor: colors.primaryFixed }]}>
              <MaterialIcons color={colors.primary} name="today" size={24} />
            </View>
            <View style={styles.cardBadgeTeal}>
              <Text style={styles.cardBadgeText}>TOMORROW</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>Cardiology Visit</Text>
          <View style={styles.cardSubRow}>
            <MaterialIcons color={colors.onSurfaceVariant} name="schedule" size={16} />
            <Text style={styles.cardSub}>10:00 AM</Text>
          </View>
        </Pressable>

        {/* Lab results card */}
        <Pressable
          onPress={() => Alert.alert("Lab Results", DASHBOARD_ACTIONS[0].placeholderMessage)}
          style={({ pressed }) => [styles.card, styles.cardAccentLavender, pressed && styles.cardPressed]}
        >
          <View style={styles.cardTopRow}>
            <View style={[styles.cardIconBox, { backgroundColor: `${colors.secondaryContainer}4D` }]}>
              <MaterialIcons color={colors.secondary} name="science" size={24} />
            </View>
            <View style={styles.cardBadgeLavender}>
              <Text style={styles.cardBadgeTextLavender}>NEW</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>Blood test results available</Text>
          <Text style={styles.cardSub}>Updated 2 hours ago</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardLink}>View Report</Text>
            <MaterialIcons color={colors.primary} name="arrow-forward" size={16} />
          </View>
        </Pressable>

        {/* Vitals grid */}
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalCard}>
            <Text style={styles.vitalLabel}>Heart Rate</Text>
            <View style={styles.vitalValueRow}>
              <Text style={styles.vitalValue}>72</Text>
              <Text style={styles.vitalUnit}>bpm</Text>
            </View>
            <View style={styles.vitalBar}>
              <View style={[styles.vitalBarFill, { width: "75%", backgroundColor: `${colors.error}66` }]} />
            </View>
          </View>
          <View style={styles.vitalCard}>
            <Text style={styles.vitalLabel}>Sleep</Text>
            <View style={styles.vitalValueRow}>
              <Text style={styles.vitalValue}>7.5</Text>
              <Text style={styles.vitalUnit}>hrs</Text>
            </View>
            <View style={styles.vitalBar}>
              <View style={[styles.vitalBarFill, { width: "50%", backgroundColor: `${colors.primary}66` }]} />
            </View>
          </View>
        </View>

        {/* Summary metrics */}
        {DASHBOARD_SUMMARY.metrics.map((metric) => (
          <Pressable
            key={metric.label}
            onPress={() => Alert.alert(metric.label, "This feature is coming soon.")}
            style={({ pressed }) => [styles.metricRow, pressed && styles.cardPressed]}
          >
            <View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricCaption}>{metric.caption}</Text>
            </View>
            <View style={styles.metricRight}>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <MaterialIcons color={colors.onSurfaceVariant} name="chevron-right" size={20} />
            </View>
          </Pressable>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <BottomNav active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  header: {
    alignItems: "center",
    backgroundColor: `${colors.surface}CC`,
    flexDirection: "row",
    height: 64,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: colors.onSurface,
    fontSize: 20,
    fontWeight: "700",
  },
  notifBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  welcomeBlock: {
    marginBottom: spacing.xl,
  },
  welcomeTitle: {
    color: colors.onSurface,
    fontSize: typography.display.fontSize,
    fontWeight: "700",
    letterSpacing: typography.display.letterSpacing,
    marginBottom: 4,
  },
  welcomeSub: {
    color: colors.onSurfaceVariant,
    fontSize: typography.body.fontSize,
    fontWeight: "500",
    opacity: 0.8,
  },
  trustBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 99,
    flexDirection: "row",
    gap: 6,
    marginBottom: spacing.xl,
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
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    borderLeftWidth: 4,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    ...shadows.card,
  },
  cardAccentTeal: {
    borderLeftColor: "#A8D8C8",
  },
  cardAccentLavender: {
    borderLeftColor: colors.secondaryFixedDim,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  cardTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  cardIconBox: {
    alignItems: "center",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  cardBadgeTeal: {
    backgroundColor: `${colors.primaryFixed}4D`,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardBadgeLavender: {
    backgroundColor: `${colors.secondaryContainer}33`,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  cardBadgeTextLavender: {
    color: colors.secondaryFixedDim,
    fontSize: 10,
    fontWeight: "700",
  },
  cardTitle: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardSubRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  cardSub: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
  },
  cardFooter: {
    alignItems: "center",
    borderTopColor: colors.surfaceContainer,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 4,
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  cardLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  vitalsGrid: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  vitalCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    flex: 1,
    padding: spacing.lg,
  },
  vitalLabel: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  vitalValueRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 4,
  },
  vitalValue: {
    color: colors.onSurface,
    fontSize: 24,
    fontWeight: "700",
  },
  vitalUnit: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
  vitalBar: {
    backgroundColor: `${colors.surfaceContainerLowest}80`,
    borderRadius: 99,
    height: 4,
    marginTop: 12,
    overflow: "hidden",
    width: "100%",
  },
  vitalBarFill: {
    borderRadius: 99,
    height: "100%",
  },
  metricRow: {
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  metricLabel: {
    color: colors.onSurface,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  metricCaption: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
  },
  metricRight: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  metricValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 8,
  },
});
