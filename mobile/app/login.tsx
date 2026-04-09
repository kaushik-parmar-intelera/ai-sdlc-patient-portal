import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../src/components/forms/primary-button";
import { TextField } from "../src/components/forms/text-field";
import { ScreenContainer } from "../src/components/layouts/screen-container";
import { DEMO_ACCOUNT } from "../src/constants/auth";
import { authenticateWithDemoAccount } from "../src/features/auth/auth-service";
import { loginSchema, type LoginFormValues } from "../src/features/auth/login-form";
import { useAuthStore } from "../src/store/auth-store";
import { colors, radii, shadows, spacing, typography } from "../src/theme";

export default function LoginScreen() {
  const signIn = useAuthStore((state) => state.signIn);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    const account = authenticateWithDemoAccount(values);

    if (!account) {
      setError("root", {
        message: "The username or password is incorrect. Try the demo credentials shown below.",
      });
      return;
    }

    signIn(account);
    router.replace("/home");
  });

  return (
    <ScreenContainer scrollable={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        <LinearGradient colors={[colors.deepTeal, colors.teal]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Patient Portal</Text>
          </View>
          <Text style={styles.heroTitle}>Welcome back</Text>
          <Text style={styles.heroCopy}>
            Sign in to open your care snapshot, next steps, and the mobile dashboard review flow.
          </Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign in</Text>
          <Text style={styles.cardCopy}>Use the shared demo account below for this MVP review.</Text>

          <Controller
            control={control}
            name="username"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextField
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.username?.message}
                label="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter username"
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
                placeholder="Enter password"
                secureTextEntry
                value={value}
              />
            )}
          />

          {errors.root?.message ? <Text accessibilityRole="alert" style={styles.inlineError}>{errors.root.message}</Text> : null}

          <PrimaryButton label={isSubmitting ? "Signing in..." : "Sign in"} onPress={onSubmit} />

          <View style={styles.demoCredentials}>
            <Text style={styles.demoHeading}>Demo credentials</Text>
            <Text style={styles.demoText}>Username: {DEMO_ACCOUNT.username}</Text>
            <Text style={styles.demoText}>Password: {DEMO_ACCOUNT.password}</Text>
          </View>

          <Pressable accessibilityRole="button" style={styles.secondaryLink}>
            <Text style={styles.secondaryLinkText}>Need help? Contact support</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    gap: spacing.xl,
    justifyContent: "center",
  },
  hero: {
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.overlay,
    borderRadius: radii.pill,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  heroBadgeText: {
    color: colors.cream,
    fontSize: typography.overline.fontSize,
    fontWeight: typography.overline.fontWeight,
    letterSpacing: typography.overline.letterSpacing,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: colors.cream,
    fontSize: typography.display.fontSize,
    fontWeight: typography.display.fontWeight,
    marginBottom: spacing.sm,
  },
  heroCopy: {
    color: colors.creamMuted,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...shadows.card,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    marginBottom: spacing.xs,
  },
  cardCopy: {
    color: colors.muted,
    fontSize: typography.body.fontSize,
    marginBottom: spacing.lg,
  },
  inlineError: {
    color: colors.error,
    marginBottom: spacing.md,
  },
  demoCredentials: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  demoHeading: {
    color: colors.ink,
    fontSize: typography.caption.fontSize,
    fontWeight: "700",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  demoText: {
    color: colors.muted,
    fontSize: typography.bodySmall.fontSize,
    marginBottom: spacing.xs,
  },
  secondaryLink: {
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  secondaryLinkText: {
    color: colors.tealDark,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "600",
    textAlign: "center",
  },
});
