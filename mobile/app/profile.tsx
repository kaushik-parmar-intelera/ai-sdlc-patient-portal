import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "../src/components/layouts/bottom-nav";
import { useAuthStore } from "../src/store/auth-store";
import { colors, radii, shadows, spacing, typography } from "../src/theme";

export default function ProfileScreen() {
  const account = useAuthStore((state) => state.account);
  const signOut = useAuthStore((state) => state.signOut);

  if (!account) {
    router.replace("/login");
    return null;
  }

  const initials = account.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const nameParts = account.displayName.split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") ?? "";

  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable hitSlop={8} onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons color={colors.onSurfaceVariant} name="arrow-back" size={24} />
        </Pressable>
        <Text style={styles.topBarTitle}>Profile</Text>
        <Pressable hitSlop={8} onPress={() => router.push("/profile-edit")}>
          <Text style={styles.editBtn}>Edit</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.displayName}>{account.displayName}</Text>
          <Text style={styles.email}>{account.email}</Text>
        </View>

        {/* Trust badge */}
        <View style={styles.trustBadge}>
          <MaterialIcons color={colors.onSurfaceVariant} name="lock" size={13} />
          <Text style={styles.trustText}>End-to-End Encrypted</Text>
        </View>

        {/* Personal info card */}
        <View style={styles.infoCard}>
          <InfoRow label="First Name" value={firstName} />
          <Divider />
          <InfoRow label="Last Name" value={lastName} />
          <Divider />
          <InfoRow label="Phone" value="+1 (555) 123-4567" />
          <Divider />
          <InfoRow label="Email" value={account.email} locked />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionLabel}>Preferences</Text>
        <View style={styles.prefCard}>
          <PrefRow
            icon="notifications"
            label="Notification Settings"
            onPress={() => Alert.alert("Notifications", "Notification settings coming soon.")}
          />
          <PrefRow
            icon="security"
            label="Security & Privacy"
            onPress={() => Alert.alert("Security", "Security settings coming soon.")}
          />
        </View>

        {/* Sign out */}
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            signOut();
            router.replace("/login");
          }}
          style={({ pressed }) => [styles.signOutBtn, pressed && styles.signOutBtnPressed]}
        >
          <MaterialIcons color={colors.error} name="logout" size={20} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 16 }} />
      </ScrollView>

      <BottomNav active="profile" />
    </SafeAreaView>
  );
}

function Divider() {
  return <View style={{ backgroundColor: "#E2E8F0", height: 1 }} />;
}

function InfoRow({ label, value, locked }: { label: string; value: string; locked?: boolean }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <View style={infoStyles.valueRow}>
        <Text style={infoStyles.value}>{value}</Text>
        {locked ? <MaterialIcons color={colors.outlineVariant} name="lock" size={16} /> : null}
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  label: {
    color: colors.onSurfaceVariant,
    fontSize: typography.body.fontSize,
    fontWeight: "500",
  },
  valueRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  value: {
    color: colors.onSurface,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
});

function PrefRow({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [prefStyles.row, pressed && prefStyles.rowPressed]}
    >
      <View style={prefStyles.iconBox}>
        <MaterialIcons color={colors.primary} name={icon as any} size={22} />
      </View>
      <Text style={prefStyles.label}>{label}</Text>
      <MaterialIcons color={colors.outlineVariant} name="chevron-right" size={22} />
    </Pressable>
  );
}

const prefStyles = StyleSheet.create({
  row: {
    alignItems: "center",
    borderRadius: 12,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
  },
  rowPressed: {
    backgroundColor: colors.surfaceContainerHighest,
  },
  iconBox: {
    alignItems: "center",
    backgroundColor: `${colors.primaryContainer}33`,
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  label: {
    color: colors.onSurface,
    flex: 1,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
});

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    height: 64,
    paddingHorizontal: spacing.xl,
  },
  backBtn: {
    width: 40,
  },
  topBarTitle: {
    color: colors.onSurface,
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  editBtn: {
    color: colors.secondaryFixedDim,
    fontSize: 15,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    alignItems: "center",
    backgroundColor: colors.secondaryFixedDim,
    borderRadius: 99,
    height: 80,
    justifyContent: "center",
    marginBottom: spacing.md,
    width: 80,
    ...shadows.float,
  },
  avatarInitials: {
    color: colors.onPrimary,
    fontSize: 28,
    fontWeight: "700",
  },
  displayName: {
    color: colors.onSurface,
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  email: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
    opacity: 0.7,
  },
  trustBadge: {
    alignItems: "center",
    alignSelf: "center",
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
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  infoCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
    overflow: "hidden",
    paddingHorizontal: spacing.lg,
    ...shadows.card,
  },
  sectionLabel: {
    color: `${colors.onSurfaceVariant}99`,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  prefCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
    padding: spacing.sm,
  },
  signOutBtn: {
    alignItems: "center",
    borderColor: `${colors.error}33`,
    borderRadius: radii.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    paddingVertical: spacing.md,
  },
  signOutBtnPressed: {
    opacity: 0.7,
  },
  signOutText: {
    color: colors.error,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
});
