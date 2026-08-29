import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import * as auth from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.email().min(1, "Email is required"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setServerError(null);

    try {
      await auth.requestPasswordReset(values.email);
      router.push({
        pathname: "./check-email",
        params: { email: values.email },
      });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to send reset email",
      );
    }
  }

  return (
    <View className="flex-1 justify-center gap-4 bg-background p-6">
      <View className="mb-4 gap-2">
        <Text className="text-3xl font-semibold text-foreground">
          Reset your password
        </Text>
        <Text className="text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </Text>
      </View>

      <View className="gap-2">
        <Label nativeID="forgot-email">Email</Label>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              aria-invalid={!!errors.email}
              aria-labelledby="forgot-email"
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

      {serverError && (
        <Text className="text-sm text-destructive">{serverError}</Text>
      )}

      <Button
        className="mt-4"
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text>Send reset link</Text>
        )}
      </Button>

      <Link href="./login">
        <Text className="text-center text-sm text-muted-foreground">
          Back to sign in
        </Text>
      </Link>
    </View>
  );
}
