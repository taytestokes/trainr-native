import { SplashScreenController } from "@/components/splash-screen-controller";
import { SessionProvider, useSession } from "@/contexts/session";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";

import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "expo-router/react-navigation";
import { useColorScheme } from "nativewind";

import { apolloClient } from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client/react";

import { StatusBar } from "expo-status-bar";

// Tailwind styles
import "../global.css";

// Handles layout
export default function RootLayout() {
  return (
    // Provide apollo client to the app
    <ApolloProvider client={apolloClient}>
      {/* Provide session context to the app */}
      <SessionProvider>
        <AppShell />
      </SessionProvider>
    </ApolloProvider>
  );
}

function AppShell() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
      {/* Sync OS status bar with the theme */}
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      {/* Handle splash screen */}
      <SplashScreenController />
      {/* Handle navigation */}
      <RootNavigator />
      {/* Portal host for react native reusable components */}
      <PortalHost />
    </ThemeProvider>
  );
}

// Handles navigation with protected routes
function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* if session than app */}
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      {/* if no session than auth */}
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
