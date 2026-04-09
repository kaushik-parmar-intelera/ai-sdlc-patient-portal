import { TextInput, TextInputProps, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../../theme";

type TextFieldProps = TextInputProps & {
  error?: string;
  label: string;
};

export function TextField({ error, label, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[styles.input, error ? styles.inputError : null]}
        {...inputProps}
      />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.ink,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.ink,
    fontSize: typography.body.fontSize,
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    color: colors.error,
    marginTop: spacing.xs,
  },
});
