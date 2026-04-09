import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#F4EFE7" } }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
      </Stack>
    </>
  );
}
