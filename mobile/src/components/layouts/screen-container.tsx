import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "../../theme";

type ScreenContainerProps = PropsWithChildren<{
  scrollable?: boolean;
}>;

export function ScreenContainer({ children, scrollable = true }: ScreenContainerProps) {
  const content = <View style={styles.content}>{children}</View>;

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      {scrollable ? (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
