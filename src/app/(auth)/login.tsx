import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useSession } from "@/contexts/session";
import * as auth from "@/lib/auth";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function LoginScreen() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setError(null);
    setIsSubmitting(true);
    try {
      const session = await auth.signIn(email, password);
      await signIn(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 justify-center gap-4 bg-background p-6">
      <Text className="text-3xl font-semibold text-foreground">Sign in</Text>

      <View className="gap-2">
        <Label nativeID="email">Email</Label>
        <Input
          aria-labelledby="email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="you@example.com"
        />
      </View>

      <View className="gap-2">
        <Label nativeID="password">Password</Label>
        <Input
          aria-labelledby="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />
      </View>

      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}

      <Button disabled={isSubmitting} onPress={handleLogin}>
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text>Sign in</Text>
        )}
      </Button>

      <Link href="./signup">
        <Text className="text-center text-primary">Create an account</Text>
      </Link>
    </View>
  );
}
