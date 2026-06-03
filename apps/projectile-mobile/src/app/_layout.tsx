import { Stack } from "expo-router";

import { AuthProvider } from "@/components/auth/auth-provider";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
