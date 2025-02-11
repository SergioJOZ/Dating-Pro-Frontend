import { View, Text } from "react-native";
import React from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <Stack>
        <Stack.Screen name="[transactionId]" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  );
}
