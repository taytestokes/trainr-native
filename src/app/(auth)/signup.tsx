import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useSession } from "@/contexts/session";
import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { signUp } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema for sign up form validation
const signupSchema = z
  .object({
    email: z.email().min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type inference for sign up form values
type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const { signIn } = useSession();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function handleSignup(values: SignupFormValues) {
    // Clear any previous server errors
    setServerError(null);

    // Try to sign user up and sign in (set session)
    try {
      // Mutation to sign up user
      const session = await signUp(values.email, values.password);
      // Set user to session
      await signIn(session);
      // Q: Do we need to redirect to home screen here?
    } catch (err) {
      // If server error, set error to message
      setServerError(err instanceof Error ? err.message : "Sign up failed");
    }
  }

  return (
    <View className="flex-1 justify-center gap-4 bg-background p-6">
      <View className="gap-2 mb-4">
        <Text className="text-3xl font-semibold text-foreground">
          Create your account
        </Text>

        <Text className="text-muted-foreground">
          Log resistance training session and track your progress over time.
        </Text>
      </View>

      <View className="gap-2">
        <Label nativeID="signup-email">Email</Label>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              aria-invalid={!!errors.email}
              aria-labelledby="signup-email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="you@email.com"
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
        <Label nativeID="signup-password">Password</Label>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              aria-invalid={!!errors.password}
              aria-labelledby="signup-password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          )}
        />
        {errors.password && (
          <Text className="text-sm text-destructive">
            {errors.password.message}
          </Text>
        )}
      </View>

      <View className="gap-2">
        <Label nativeID="signup-confirm-password">Confirm Password</Label>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              aria-invalid={!!errors.confirmPassword}
              aria-labelledby="signup-confirm-password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry
              autoComplete="new-password"
              placeholder="Re-enter password"
            />
          )}
        />
        {errors.confirmPassword && (
          <Text className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </Text>
        )}
      </View>

      {serverError && (
        <Text className="text-sm text-destructive">{serverError}</Text>
      )}

      <Button
        className="mt-4"
        disabled={isSubmitting}
        onPress={handleSubmit(handleSignup)}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text>Create account</Text>
        )}
      </Button>

      <Link href="./login">
        <Text className="text-muted-foreground text-center text-sm">
          Already have an account? Sign in
        </Text>
      </Link>
    </View>
  );
}
