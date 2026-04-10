import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, shadows } from "../../theme";

type Tab = "home" | "appointments" | "prescriptions" | "profile";

type BottomNavProps = {
  active: Tab;
};

const tabs: { id: Tab; label: string; icon: string; route: string }[] = [
  { id: "home", label: "Home", icon: "home", route: "/home" },
  { id: "appointments", label: "Appointments", icon: "today", route: "/appointments" },
  { id: "prescriptions", label: "Prescriptions", icon: "medication", route: "/prescriptions" },
  { id: "profile", label: "Profile", icon: "person", route: "/profile" },
];

export function BottomNav({ active }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            key={tab.id}
            onPress={() => router.replace(tab.route as any)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <MaterialIcons
              color={isActive ? colors.primary : colors.onSurfaceVariant}
              name={tab.icon as any}
              size={24}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    alignItems: "center",
    backgroundColor: `${colors.surfaceContainerLowest}E6`,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    ...shadows.nav,
  },
  tab: {
    alignItems: "center",
    borderRadius: 16,
    flex: 1,
    gap: 4,
    paddingVertical: 8,
  },
  tabActive: {
    backgroundColor: `${colors.primaryFixed}4D`,
  },
  tabLabel: {
    color: colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "500",
  },
  tabLabelActive: {
    color: colors.primary,
  },
});
