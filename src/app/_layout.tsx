import { SplashScreenController } from "@/components/splash-screen-controller";
import { SessionProvider, useSession } from "@/contexts/session";
import { Stack } from "expo-router";

// Handles layout
export default function RootLayout() {
  return (
    // Provide session context to the app
    <SessionProvider>
      {/* Handle splash screen */}
      <SplashScreenController />
      {/* Handle navigation */}
      <RootNavigator />
    </SessionProvider>
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
