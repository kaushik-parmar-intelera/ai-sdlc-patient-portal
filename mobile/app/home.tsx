import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { DashboardCard } from "../src/components/layouts/dashboard-card";
import { DashboardHeader } from "../src/components/layouts/dashboard-header";
import { ScreenContainer } from "../src/components/layouts/screen-container";
import { DASHBOARD_ACTIONS, DASHBOARD_SUMMARY } from "../src/constants/dashboard";
import { getProtectedRedirectPath } from "../src/features/auth/route-guard";
import { buildDashboardCards } from "../src/features/home/home-model";
import { useAuthStore } from "../src/store/auth-store";
import { colors, radii, shadows, spacing, typography } from "../src/theme";

export default function HomeScreen() {
  const account = useAuthStore((state) => state.account);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    const redirectPath = getProtectedRedirectPath(isAuthenticated);
    if (redirectPath) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !account) {
    return null;
  }

  const cards = buildDashboardCards(DASHBOARD_SUMMARY);

  return (
    <ScreenContainer>
      <DashboardHeader
        eyebrow="Today's overview"
        subtitle="A fixed dashboard dataset keeps the MVP consistent for design review and protected-flow testing."
        title={`Hello, ${account.displayName}`}
      />

      <View style={styles.summaryGrid}>
        {cards.map((card) => (
          <DashboardCard key={card.label} caption={card.caption} label={card.label} tone={card.tone} value={card.value} />
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Care spotlight</Text>
        <Text style={styles.panelCopy}>
          Next check-in with Dr. Maya Singh is scheduled for Tuesday at 10:30 AM. Bring your latest home readings.
        </Text>
      </View>

      <View style={styles.actionPanel}>
        <Text style={styles.panelTitle}>Quick actions</Text>
        <View style={styles.actionGrid}>
          {DASHBOARD_ACTIONS.map((action) => (
            <Pressable
              accessibilityRole="button"
              key={action.label}
              onPress={() => Alert.alert(action.label, action.placeholderMessage)}
              style={styles.actionButton}
            >
              <Text style={styles.actionTitle}>{action.label}</Text>
              <Text style={styles.actionCopy}>{action.description}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          signOut();
          router.replace("/login");
        }}
        style={styles.signOut}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    ...shadows.card,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: typography.titleSmall.fontSize,
    fontWeight: typography.titleSmall.fontWeight,
    marginBottom: spacing.sm,
  },
  panelCopy: {
    color: colors.muted,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  actionPanel: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    ...shadows.card,
  },
  actionGrid: {
    gap: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  actionTitle: {
    color: colors.ink,
    fontSize: typography.body.fontSize,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  actionCopy: {
    color: colors.muted,
    fontSize: typography.bodySmall.fontSize,
    lineHeight: typography.bodySmall.lineHeight,
  },
  signOut: {
    alignItems: "center",
    backgroundColor: colors.deepTeal,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  signOutText: {
    color: colors.cream,
    fontSize: typography.body.fontSize,
    fontWeight: "700",
  },
});
