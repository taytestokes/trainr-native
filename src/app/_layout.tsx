import { SplashScreenController } from "@/components/splash-screen-controller";
import { SessionProvider, useSession } from "@/contexts/session";
import { Stack } from "expo-router";

import { apolloClient } from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client/react";

// Handles layout
export default function RootLayout() {
  return (
    // Provide apollo client to the app
    <ApolloProvider client={apolloClient}>
      {/* Provide session context to the app */}
      <SessionProvider>
        {/* Handle splash screen */}
        <SplashScreenController />
        {/* Handle navigation */}
        <RootNavigator />
      </SessionProvider>
    </ApolloProvider>
  );
}

// Handles navigation
function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
