import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, spacing, typography } from "../../theme";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
};

export function PrimaryButton({ label, onPress }: PrimaryButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.deepTeal,
    borderRadius: radii.pill,
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  label: {
    color: colors.cream,
    fontSize: typography.body.fontSize,
    fontWeight: "700",
  },
});
