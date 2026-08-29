import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function CheckEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const displayEmail =
    typeof email === "string" && email.length > 0 ? email : "your email address";

  return (
    <View className="flex-1 justify-center gap-4 bg-background p-6">
      <View className="mb-4 gap-2">
        <Text className="text-3xl font-semibold text-foreground">
          Check your email
        </Text>
        <Text className="text-muted-foreground">
          If an account exists for{" "}
          <Text className="font-medium text-foreground">{displayEmail}</Text>,
          we sent password reset instructions.
        </Text>
        <Text className="text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder or try again in a few
          minutes.
        </Text>
      </View>

      <Button className="mt-4" onPress={() => router.push("./login")}>
        <Text>Back to sign in</Text>
      </Button>

      <Link href="./forgot-password">
        <Text className="text-center text-sm text-muted-foreground">
          Try a different email
        </Text>
      </Link>
    </View>
  );
}
