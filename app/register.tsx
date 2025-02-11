import { View, Text } from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import RegisterForm from "@/components/RegisterForm";

export default function Register() {
  return (
    <VStack space="md" className="bg-background-50 h-full">
      <Text className="text-center text-4xl pt-6 pb-6 text-white">
        Registrate
      </Text>

      <RegisterForm />
    </VStack>
  );
}
