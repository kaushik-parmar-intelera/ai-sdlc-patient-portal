import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, typography } from "../../theme";

type PrimaryButtonProps = {
  disabled?: boolean;
  label: string;
  loading?: boolean;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export function PrimaryButton({ disabled, label, loading, onPress, variant = "primary" }: PrimaryButtonProps) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
        (pressed || disabled || loading) ? styles.buttonPressed : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.onPrimaryContainer : colors.onSurfaceVariant} />
      ) : (
        <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radii.md,
    height: 56,
    justifyContent: "center",
    width: "100%",
  },
  buttonPrimary: {
    backgroundColor: colors.primaryContainer,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderColor: colors.secondaryFixedDim,
    borderWidth: 2,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
  labelPrimary: {
    color: colors.onPrimaryContainer,
  },
  labelSecondary: {
    color: colors.onSurfaceVariant,
  },
});
