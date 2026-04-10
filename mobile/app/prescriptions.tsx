import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "../src/components/layouts/bottom-nav";
import { colors, spacing, typography } from "../src/theme";

export default function PrescriptionsScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prescriptions</Text>
      </View>
      <View style={styles.placeholder}>
        <MaterialIcons color={colors.surfaceContainerHighest} name="medication" size={64} />
        <Text style={styles.placeholderTitle}>Prescriptions</Text>
        <Text style={styles.placeholderBody}>
          Prescription management and refill requests will be available after backend integration.
        </Text>
      </View>
      <BottomNav active="prescriptions" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  header: {
    height: 64,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: colors.onSurface,
    fontSize: 20,
    fontWeight: "700",
  },
  placeholder: {
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  placeholderTitle: {
    color: colors.onSurfaceVariant,
    fontSize: typography.headlineLg.fontSize,
    fontWeight: typography.headlineLg.fontWeight,
    textAlign: "center",
  },
  placeholderBody: {
    color: colors.onSurfaceVariant,
    fontSize: typography.body.fontSize,
    lineHeight: 24,
    opacity: 0.7,
    textAlign: "center",
  },
});
