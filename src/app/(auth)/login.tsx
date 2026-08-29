import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useSession } from "@/contexts/session";
import * as auth from "@/lib/auth";
import { Link } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useState } from "react";

const loginSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Please enter your password"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { signIn } = useSession();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(values: LoginFormValues) {
    setServerError(null);

    try {
      const session = await auth.signIn(values.email, values.password);
      await signIn(session);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Sign in failed");
    }
  }

  return (
    <View className="flex-1 justify-center gap-4 bg-background p-6">
      <View className="gap-2 mb-4">
        <Text className="text-3xl font-semibold text-foreground">
          Welcome back
        </Text>

        <Text className="text-muted-foreground">
          Sign in to continue logging sessions.
        </Text>
      </View>

      <View className="gap-2">
        <Label nativeID="email">Email</Label>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              aria-labelledby="email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="you@example.com"
            />
          )}
        />
        {errors.email && (
          <Text className="text-sm text-destructive">
            {errors.email.message}
          </Text>
        )}
      </View>

      <View className="gap-2">
        <Label nativeID="password">Password</Label>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              aria-labelledby="password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry
              placeholder="••••••••"
            />
          )}
        />
        {errors.password && (
          <Text className="text-sm text-destructive">
            {errors.password.message}
          </Text>
        )}
      </View>

      {serverError && (
        <Text className="text-sm text-destructive">{serverError}</Text>
      )}

      <Button
        className="mt-4"
        disabled={isSubmitting}
        onPress={handleSubmit(handleLogin)}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text>Sign in</Text>
        )}
      </Button>

      <Link href="./signup">
        <Text className="text-muted-foreground text-center text-sm">
          New here? Create an account
        </Text>
      </Link>
    </View>
  );
}
