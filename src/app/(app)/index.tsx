import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSession } from "@/contexts/session";
import { View } from "react-native";

export default function HomeScreen() {
  const { session, signOut } = useSession();

  return (
    <View className="flex-1 items-center justify-center gap-3 bg-background p-6">
      <Text className="text-2xl font-semibold text-foreground">
        Welcome to Trainr
      </Text>
      <Text className="text-muted-foreground">{session?.user.email}</Text>
      <Button className="mt-4" onPress={signOut}>
        <Text>Sign out</Text>
      </Button>
    </View>
  );
}
