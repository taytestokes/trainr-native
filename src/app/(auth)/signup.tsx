import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useSession } from "@/contexts/session";
import * as auth from "@/lib/auth";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function SignupScreen() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup() {
    setError(null);
    setIsSubmitting(true);

    try {
      const session = await auth.signUp(email, password);
      await signIn(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 justify-center gap-4 bg-background p-6">
      <Text className="text-3xl font-semibold text-foreground">
        Create account
      </Text>

      <View className="gap-2">
        <Label nativeID="signup-email">Email</Label>
        <Input
          aria-labelledby="signup-email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="you@example.com"
        />
      </View>

      <View className="gap-2">
        <Label nativeID="signup-password">Password</Label>
        <Input
          aria-labelledby="signup-password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </View>

      {error ? <Text className="text-sm text-destructive">{error}</Text> : null}

      <Button disabled={isSubmitting} onPress={handleSignup}>
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text>Sign up</Text>
        )}
      </Button>

      <Link href="./login">
        <Text className="text-center text-primary">
          Already have an account? Sign in
        </Text>
      </Link>
    </View>
  );
}
