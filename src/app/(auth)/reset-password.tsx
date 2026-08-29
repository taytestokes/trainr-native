import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import * as auth from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const resetToken = typeof token === "string" ? token : "";
  const hasToken = resetToken.length > 0;

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!hasToken) {
      return;
    }

    setServerError(null);

    try {
      await auth.resetPassword(resetToken, values.password);
      router.replace({
        pathname: "./login",
        params: { reset: "success" },
      });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Failed to reset password",
      );
    }
  }

  if (!hasToken) {
    return (
      <View className="flex-1 justify-center gap-4 bg-background p-6">
        <View className="mb-4 gap-2">
          <Text className="text-3xl font-semibold text-foreground">
            Invalid reset link
          </Text>
          <Text className="text-muted-foreground">
            This password reset link is invalid or has expired. Request a new
            one to continue.
          </Text>
        </View>

        <Button
          className="mt-4"
          onPress={() => router.push("./forgot-password")}
        >
          <Text>Request new link</Text>
        </Button>

        <Link href="./login">
          <Text className="text-center text-sm text-muted-foreground">
            Back to sign in
          </Text>
        </Link>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center gap-4 bg-background p-6">
      <View className="mb-4 gap-2">
        <Text className="text-3xl font-semibold text-foreground">
          Choose a new password
        </Text>
        <Text className="text-muted-foreground">
          Enter and confirm your new password below.
        </Text>
      </View>

      <View className="gap-2">
        <Label nativeID="reset-password">New password</Label>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              aria-invalid={!!errors.password}
              aria-labelledby="reset-password"
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
        <Label nativeID="reset-confirm-password">Confirm password</Label>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              aria-invalid={!!errors.confirmPassword}
              aria-labelledby="reset-confirm-password"
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
        onPress={handleSubmit(onSubmit)}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text>Reset password</Text>
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
