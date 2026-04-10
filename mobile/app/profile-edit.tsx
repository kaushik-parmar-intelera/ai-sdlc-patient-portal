import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TextField } from "../src/components/forms/text-field";
import { useAuthStore } from "../src/store/auth-store";
import { colors, radii, shadows, spacing, typography } from "../src/theme";

export default function ProfileEditScreen() {
  const account = useAuthStore((state) => state.account);

  const nameParts = account?.displayName.split(" ") ?? ["", ""];
  const [firstName, setFirstName] = useState(nameParts[0] ?? "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") ?? "");
  const [phone, setPhone] = useState("555-0123");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.back();
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Top bar: Cancel / Profile / Save */}
      <View style={styles.topBar}>
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Text style={styles.cancelBtn}>Cancel</Text>
        </Pressable>
        <Text style={styles.topBarTitle}>Profile</Text>
        <Pressable hitSlop={8} onPress={handleSave}>
          <Text style={styles.saveBtn}>Save</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar with camera button */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>
                  {(firstName[0] ?? "").toUpperCase()}
                  {(lastName[0] ?? "").toUpperCase()}
                </Text>
              </View>
              <Pressable style={styles.cameraBtn}>
                <MaterialIcons color={colors.onPrimaryContainer} name="photo-camera" size={16} />
              </Pressable>
            </View>
            <Text style={styles.changePhotoText}>Change profile photo</Text>
          </View>

          {/* Editable fields */}
          <TextField
            label="First Name"
            onChangeText={setFirstName}
            placeholder="First Name"
            value={firstName}
          />
          <TextField
            label="Last Name"
            onChangeText={setLastName}
            placeholder="Last Name"
            value={lastName}
          />

          {/* Phone with country dropdown */}
          <View style={styles.phoneRow}>
            <Pressable style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+1</Text>
              <MaterialIcons color={colors.onSurfaceVariant} name="expand-more" size={18} />
            </Pressable>
            <View style={styles.phoneInput}>
              <TextField
                keyboardType="phone-pad"
                label="Phone Number"
                onChangeText={setPhone}
                placeholder="555-0123"
                value={phone}
              />
            </View>
          </View>

          {/* Locked email */}
          <Text style={styles.fieldLabel}>Email Address</Text>
          <View style={styles.lockedInput}>
            <Text style={styles.lockedText} numberOfLines={1}>
              {account?.email ?? ""}
            </Text>
            <MaterialIcons color={colors.outlineVariant} name="lock" size={18} />
          </View>
          <Text style={styles.lockedHint}>Email cannot be changed for security reasons.</Text>

          {/* Security badge */}
          <View style={styles.securityCard}>
            <View style={styles.securityIconBox}>
              <MaterialIcons color={colors.primary} name="verified-user" size={22} />
            </View>
            <View>
              <Text style={styles.securityTitle}>Secure Account</Text>
              <Text style={styles.securityBody}>
                Your personal data is encrypted and stored according to HIPAA standards.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success toast */}
      {saved ? (
        <View style={styles.toast}>
          <View style={styles.toastIcon}>
            <MaterialIcons color={colors.onPrimary} name="check" size={16} />
          </View>
          <Text style={styles.toastText}>Profile updated successfully.</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    height: 64,
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
  },
  cancelBtn: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "500",
  },
  topBarTitle: {
    color: colors.onSurface,
    fontSize: 18,
    fontWeight: "600",
  },
  saveBtn: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  avatarWrapper: {
    marginBottom: spacing.sm,
    position: "relative",
  },
  avatarCircle: {
    alignItems: "center",
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.surfaceContainerLowest,
    borderRadius: 99,
    borderWidth: 4,
    height: 112,
    justifyContent: "center",
    width: 112,
    ...shadows.card,
  },
  avatarInitials: {
    color: colors.onSurface,
    fontSize: 36,
    fontWeight: "700",
  },
  cameraBtn: {
    alignItems: "center",
    backgroundColor: colors.primaryContainer,
    borderColor: colors.surfaceContainerLowest,
    borderRadius: 99,
    borderWidth: 2,
    bottom: 0,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    width: 34,
    ...shadows.card,
  },
  changePhotoText: {
    color: colors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "500",
  },
  phoneRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing.sm,
  },
  countryCode: {
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: `${colors.outlineVariant}33`,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    height: 52,
    justifyContent: "center",
    marginBottom: 16,
    paddingHorizontal: spacing.md,
  },
  countryCodeText: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
  },
  fieldLabel: {
    color: colors.onSurfaceVariant,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  lockedInput: {
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.md,
    flexDirection: "row",
    height: 52,
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: spacing.md,
  },
  lockedText: {
    color: `${colors.onSurfaceVariant}B3`,
    flex: 1,
    fontSize: typography.body.fontSize,
    fontWeight: "500",
  },
  lockedHint: {
    color: `${colors.onSurfaceVariant}99`,
    fontSize: 11,
    fontStyle: "italic",
    marginBottom: spacing.xl,
    marginLeft: 4,
  },
  securityCard: {
    alignItems: "flex-start",
    backgroundColor: `${colors.surfaceContainerHigh}66`,
    borderRadius: radii.xl,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.xl,
  },
  securityIconBox: {
    backgroundColor: `${colors.primary}1A`,
    borderRadius: radii.md,
    padding: 8,
  },
  securityTitle: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  securityBody: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 220,
  },
  toast: {
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderColor: "#D1FAE5",
    borderRadius: radii.xl,
    borderWidth: 1,
    bottom: 120,
    flexDirection: "row",
    gap: spacing.sm,
    left: spacing.xl,
    padding: spacing.lg,
    position: "absolute",
    right: spacing.xl,
    ...shadows.float,
  },
  toastIcon: {
    alignItems: "center",
    backgroundColor: "#22C55E",
    borderRadius: 99,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  toastText: {
    color: "#14532D",
    fontSize: 14,
    fontWeight: "600",
  },
});
