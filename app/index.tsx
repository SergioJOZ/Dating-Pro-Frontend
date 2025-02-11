import LoginForm from "@/components/LoginForm";
import { VStack } from "@/components/ui/vstack";
import { Text } from "react-native";
import { useFonts, Charm_400Regular } from "@expo-google-fonts/charm";
export default function Index() {
  let [fontsLoaded] = useFonts({ Charm_400Regular });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <VStack space="md" className="bg-background-50 h-full">
      <Text
        style={{ fontFamily: "Charm_400Regular" }}
        className="text-center text-white text-7xl pt-16 pb-6"
      >
        Dating {"\n"} <Text className="text-cards-red">Pro</Text>
      </Text>

      <LoginForm />
    </VStack>
  );
}
