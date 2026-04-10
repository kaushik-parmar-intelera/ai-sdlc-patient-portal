import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors, radii, spacing, typography } from "../../theme";

type TextFieldProps = TextInputProps & {
  error?: string;
  label: string;
};

export function TextField({ error, label, secureTextEntry, style, ...inputProps }: TextFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        {secureTextEntry ? (
          <MaterialIcons name="lock" size={20} color={colors.onSurfaceVariant} style={styles.leftIcon} />
        ) : null}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.outline}
          secureTextEntry={secureTextEntry && !visible}
          style={[styles.input, secureTextEntry ? styles.inputWithIcon : null]}
          {...inputProps}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityLabel={visible ? "Hide password" : "Show password"}
            hitSlop={8}
            onPress={() => setVisible((v) => !v)}
            style={styles.eyeButton}
          >
            <MaterialIcons
              color={colors.onSurfaceVariant}
              name={visible ? "visibility" : "visibility-off"}
              size={20}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.onSurfaceVariant,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  inputRow: {
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderColor: `${colors.outlineVariant}33`,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    height: 52,
    overflow: "hidden",
  },
  inputRowError: {
    borderColor: colors.error,
  },
  leftIcon: {
    marginLeft: spacing.md,
  },
  input: {
    color: colors.onSurface,
    flex: 1,
    fontSize: typography.body.fontSize,
    paddingHorizontal: spacing.md,
  },
  inputWithIcon: {
    paddingLeft: spacing.sm,
  },
  eyeButton: {
    paddingHorizontal: spacing.md,
  },
  error: {
    color: colors.error,
    fontSize: typography.caption.fontSize,
    marginLeft: 4,
    marginTop: spacing.xs,
  },
});
