import { Stack, Tabs, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import useUser from "@/hooks/useUser";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StripeProvider } from "@stripe/stripe-react-native";
import { BlurView } from "expo-blur";
import { View } from "react-native";
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light,
  Montserrat_300Light_Italic,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black,
  Montserrat_900Black_Italic,
} from "@expo-google-fonts/montserrat";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const hide = segments.includes("(map)");
  const { authUser, user } = useUser();
  const [loaded, error] = useFonts({
    Montserrat_100Thin,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light,
    Montserrat_300Light_Italic,
    Montserrat_400Regular,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black,
    Montserrat_900Black_Italic,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY as string}
    >
      <GluestackUIProvider mode="dark">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              display: hide ? "none" : "flex",
              backgroundColor: "#101010",
            },
            tabBarActiveTintColor: "#8a2232",
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Inicio",
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="home" size={24} color="#8a2232" />
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Perfil",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="user" size={24} color="#8a2232" />
              ),
            }}
          />
          <Tabs.Screen
            name="(map)"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="(hirings)/hirings"
            options={{
              title: "Contrataciones",
              tabBarIcon: ({ color }) => (
                <AntDesign name="hearto" size={24} color="#8a2232" />
              ),
            }}
          />
        </Tabs>
      </GluestackUIProvider>
    </StripeProvider>
  );
}
