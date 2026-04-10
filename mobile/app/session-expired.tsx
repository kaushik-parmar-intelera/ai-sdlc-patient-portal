import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TextField } from "../src/components/forms/text-field";
import { authenticateWithDemoAccount } from "../src/features/auth/auth-service";
import { loginSchema, type LoginFormValues } from "../src/features/auth/login-form";
import { useAuthStore } from "../src/store/auth-store";
import { colors, radii, spacing, typography } from "../src/theme";

export default function SessionExpiredScreen() {
  const signIn = useAuthStore((state) => state.signIn);
  const [bannerVisible, setBannerVisible] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    const account = authenticateWithDemoAccount(values);
    if (!account) {
      setError("root", { message: "Incorrect email or password. Please try again." });
      return;
    }
    signIn(account);
    router.replace("/home");
  });

  return (
    <SafeAreaView style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable hitSlop={8} onPress={() => router.replace("/login")} style={styles.backBtn}>
          <MaterialIcons color={colors.primary} name="arrow-back" size={24} />
        </Pressable>
        <Text style={styles.topBarTitle}>Health Portal</Text>
        <View style={styles.topBarSpacer} />
      </View>

      {/* Peach session expired banner */}
      {bannerVisible ? (
        <View style={styles.banner}>
          <MaterialIcons color={colors.onSurfaceVariant} name="info" size={20} />
          <Text style={styles.bannerText}>
            Your session expired due to inactivity. Please sign in again.
          </Text>
          <Pressable hitSlop={8} onPress={() => setBannerVisible(false)}>
            <MaterialIcons color={colors.onSurfaceVariant} name="close" size={20} />
          </Pressable>
        </View>
      ) : null}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Lock icon */}
          <View style={styles.iconWrapper}>
            <MaterialIcons color={colors.primary} name="lock-open" size={48} />
          </View>

          {/* Headline */}
          <View style={styles.headlineBlock}>
            <Text style={styles.headline}>Welcome back</Text>
            <Text style={styles.subheadline}>
              Sign in to your clinical profile to access your health data securely.
            </Text>
          </View>

          {/* Trust badge */}
          <View style={styles.trustBadge}>
            <MaterialIcons color={colors.onSurfaceVariant} name="lock" size={13} />
            <Text style={styles.trustText}>End-to-End Encrypted</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextField
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  label="Email Address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="name@medical.com"
                  value={value}
                />
              )}
            />

            <View style={styles.passwordLabelRow}>
              <Text style={styles.fieldLabel}>Password</Text>
              <Pressable>
                <Text style={styles.forgotText}>Forgot?</Text>
              </Pressable>
            </View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextField
                  error={errors.password?.message}
                  label=""
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                />
              )}
            />
          </View>

          {errors.root?.message ? (
            <View style={styles.errorBanner}>
              <MaterialIcons color={colors.error} name="error-outline" size={18} />
              <Text style={styles.errorText}>{errors.root.message}</Text>
            </View>
          ) : null}

          {/* Sign in button */}
          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={onSubmit}
            style={({ pressed }) => [styles.signInBtn, (pressed || isSubmitting) && styles.signInBtnPressed]}
          >
            <Text style={styles.signInBtnText}>{isSubmitting ? "Signing in…" : "Sign In"}</Text>
            <MaterialIcons color={colors.onPrimaryContainer} name="arrow-forward" size={20} />
          </Pressable>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Don't have an account?</Text>
            <Pressable hitSlop={4} onPress={() => router.push("/register")}>
              <Text style={styles.registerLink}> Register here</Text>
            </Pressable>
          </View>

          {/* Quick-access cards */}
          <View style={styles.quickCards}>
            <View style={styles.quickCard}>
              <MaterialIcons color={colors.primaryFixedDim} name="emergency" size={28} />
              <Text style={styles.quickCardLabel}>Emergency Care</Text>
            </View>
            <View style={styles.quickCard}>
              <MaterialIcons color={colors.primaryFixedDim} name="headset-mic" size={28} />
              <Text style={styles.quickCardLabel}>Patient Support</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  topBarSpacer: {
    width: 40,
  },
  banner: {
    alignItems: "center",
    backgroundColor: "#F5C6A0",
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  bannerText: {
    color: colors.onSurfaceVariant,
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconWrapper: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: `${colors.primaryContainer}33`,
    borderRadius: 32,
    height: 96,
    justifyContent: "center",
    marginBottom: spacing.xxl,
    width: 96,
  },
  headlineBlock: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  headline: {
    color: colors.onSurface,
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: -0.3,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subheadline: {
    color: colors.onSurfaceVariant,
    fontSize: typography.body.fontSize,
    lineHeight: 24,
    textAlign: "center",
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
  form: {
    marginBottom: spacing.md,
  },
  passwordLabelRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  fieldLabel: {
    color: colors.onSurfaceVariant,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  errorBanner: {
    alignItems: "center",
    backgroundColor: colors.errorContainer,
    borderRadius: radii.lg,
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  errorText: {
    color: colors.error,
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  signInBtn: {
    alignItems: "center",
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.md,
    flexDirection: "row",
    gap: spacing.sm,
    height: 56,
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  signInBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  signInBtnText: {
    color: colors.onPrimaryContainer,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
  registerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  registerPrompt: {
    color: colors.onSurfaceVariant,
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  quickCards: {
    flexDirection: "row",
    gap: spacing.md,
  },
  quickCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    flex: 1,
    gap: spacing.sm,
    justifyContent: "flex-end",
    minHeight: 128,
    padding: spacing.lg,
  },
  quickCardLabel: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
