import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TextField } from "../src/components/forms/text-field";
import { loginSchema, type LoginFormValues } from "../src/features/auth/login-form";
import { apiLogin } from "../src/services/auth-api";
import { useAuthStore } from "../src/store/auth-store";
import { colors, radii, spacing, typography } from "../src/theme";

export default function LoginScreen() {
  const signIn = useAuthStore((state) => state.signIn);

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
    try {
      const data = await apiLogin(values.email, values.password);
      const account = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        displayName: `${data.user.firstName} ${data.user.lastName}`.trim(),
        role: data.user.role,
      };
      signIn(account, data.accessToken, data.refreshToken);
      router.replace("/home");
    } catch (err: any) {
      setError("root", { message: err?.message ?? "Incorrect email or password. Please try again." });
    }
  });

  return (
    <SafeAreaView style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable hitSlop={8} onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons color={colors.primary} name="arrow-back" size={24} />
        </Pressable>
        <Text style={styles.topBarTitle}>Sign In</Text>
        <View style={styles.topBarSpacer} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Headline */}
          <View style={styles.headlineBlock}>
            <Text style={styles.headline}>Welcome back</Text>
            <Text style={styles.subheadline}>Sign in to access your health portal.</Text>
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
                  label="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="name@example.com"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <TextField
                  error={errors.password?.message}
                  label="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                />
              )}
            />

            <Pressable accessibilityRole="button" style={styles.forgotLink}>
              <Text style={styles.forgotText}>Forgot your password?</Text>
            </Pressable>
          </View>

          {/* Security badge */}
          <View style={styles.securityCard}>
            <View style={styles.securityIconBox}>
              <MaterialIcons color={colors.primary} name="verified-user" size={24} />
            </View>
            <View style={styles.securityText}>
              <Text style={styles.securityTitle}>Secure Clinical Login</Text>
              <Text style={styles.securityBody}>
                Your data is protected by end-to-end medical grade encryption.
              </Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        {errors.root?.message ? (
          <View style={styles.errorBanner}>
            <MaterialIcons color={colors.error} name="error-outline" size={20} />
            <Text style={styles.errorText}>{errors.root.message}</Text>
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={onSubmit}
          style={({ pressed }) => [styles.signInBtn, (pressed || isSubmitting) && styles.signInBtnPressed]}
        >
          <Text style={styles.signInBtnText}>{isSubmitting ? "Signing in…" : "Sign In"}</Text>
        </Pressable>

        <View style={styles.registerRow}>
          <Text style={styles.registerPrompt}>Don't have an account?</Text>
          <Pressable hitSlop={4} onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}> Register</Text>
          </Pressable>
        </View>
      </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headlineBlock: {
    marginBottom: spacing.xxl,
  },
  headline: {
    color: colors.onSurface,
    fontSize: 32,
    fontWeight: "600",
    letterSpacing: -0.5,
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
  subheadline: {
    color: colors.onSurfaceVariant,
    fontSize: 18,
    lineHeight: 26,
    opacity: 0.8,
  },
  form: {
    marginBottom: spacing.xl,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginTop: -4,
    paddingVertical: spacing.xs,
  },
  forgotText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  securityCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radii.xl,
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  securityIconBox: {
    alignSelf: "flex-start",
    backgroundColor: `${colors.primaryFixed}4D`,
    borderRadius: radii.md,
    padding: 8,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  securityBody: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    backgroundColor: colors.surface,
    gap: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  errorBanner: {
    alignItems: "center",
    backgroundColor: colors.errorContainer,
    borderRadius: radii.lg,
    flexDirection: "row",
    gap: spacing.sm,
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
    height: 56,
    justifyContent: "center",
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
});
