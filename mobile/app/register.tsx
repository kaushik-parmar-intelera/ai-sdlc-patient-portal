import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TextField } from "../src/components/forms/text-field";
import { colors, radii, spacing, typography } from "../src/theme";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable hitSlop={8} onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons color={colors.onSurfaceVariant} name="arrow-back" size={24} />
        </Pressable>
        <Text style={styles.topBarTitle}>Register</Text>
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
            <Text style={styles.headline}>Create your{"\n"}account</Text>
            <Text style={styles.subheadline}>Enter your details to get started.</Text>
          </View>

          {/* Form */}
          <TextField
            label="First Name"
            onChangeText={setFirstName}
            placeholder="John"
            value={firstName}
          />
          <TextField
            label="Last Name"
            onChangeText={setLastName}
            placeholder="Doe"
            value={lastName}
          />

          {/* Phone with country code */}
          <View style={styles.phoneRow}>
            <Pressable style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+1</Text>
              <MaterialIcons color={colors.onSurfaceVariant} name="expand-more" size={18} />
            </Pressable>
            <View style={styles.phoneInput}>
              <TextField
                keyboardType="phone-pad"
                label="Phone"
                onChangeText={setPhone}
                placeholder="(555) 000-0000"
                value={phone}
              />
            </View>
          </View>

          <TextField
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            label="Email"
            onChangeText={setEmail}
            placeholder="name@example.com"
            value={email}
          />

          <TextField
            label="Password"
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            value={password}
          />

          {/* Password hints */}
          <View style={styles.hintList}>
            <PasswordHint met={password.length >= 8} text="At least 8 characters" />
            <PasswordHint met={/[!@#$%^&*]/.test(password)} text="One special character" />
            <PasswordHint met={/\d/.test(password)} text="One numerical digit" />
          </View>

          {/* Trust badge */}
          <View style={styles.trustBadge}>
            <MaterialIcons color={colors.onSurfaceVariant} name="lock" size={14} />
            <Text style={styles.trustText}>End-to-End Encrypted Data Storage</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/login")}
          style={({ pressed }) => [styles.createBtn, pressed && styles.createBtnPressed]}
        >
          <Text style={styles.createBtnText}>Create Account</Text>
        </Pressable>
        <Text style={styles.terms}>
          By creating an account, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function PasswordHint({ met, text }: { met: boolean; text: string }) {
  return (
    <View style={passwordHintStyles.row}>
      <View
        style={[
          passwordHintStyles.dot,
          { backgroundColor: met ? colors.primaryContainer : colors.surfaceContainerHigh },
        ]}
      />
      <Text style={passwordHintStyles.text}>{text}</Text>
    </View>
  );
}

const passwordHintStyles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  dot: {
    borderRadius: 99,
    height: 8,
    width: 8,
  },
  text: {
    color: colors.onSurfaceVariant,
    fontSize: typography.caption.fontSize,
  },
});

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
    fontSize: typography.body.fontSize,
    lineHeight: 24,
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
  hintList: {
    marginBottom: spacing.xl,
    marginTop: -spacing.sm,
    paddingLeft: 4,
  },
  trustBadge: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 99,
    flexDirection: "row",
    gap: 6,
    marginBottom: spacing.xl,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  trustText: {
    color: colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "500",
  },
  footer: {
    backgroundColor: `${colors.surfaceContainerLowest}E6`,
    gap: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  createBtn: {
    alignItems: "center",
    backgroundColor: colors.primaryContainer,
    borderRadius: radii.md,
    height: 56,
    justifyContent: "center",
  },
  createBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  createBtnText: {
    color: colors.onPrimaryContainer,
    fontSize: 16,
    fontWeight: "600",
  },
  terms: {
    color: colors.onSurfaceVariant,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  termsLink: {
    textDecorationLine: "underline",
  },
});
