import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../theme";

type ScreenContainerProps = PropsWithChildren<{
  scrollable?: boolean;
  edges?: ("top" | "bottom" | "left" | "right")[];
  padded?: boolean;
}>;

export function ScreenContainer({ children, scrollable = true, edges = ["top", "bottom"], padded = true }: ScreenContainerProps) {
  const content = <View style={[styles.content, !padded && styles.noPad]}>{children}</View>;

  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
    backgroundColor: colors.surface,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  noPad: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
