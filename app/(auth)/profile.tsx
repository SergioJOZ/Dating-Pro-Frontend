import { View, Text } from "react-native";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import UserProfile from "@/components/UserProfile";

export default function Profile() {
  return (
    <VStack>
      <UserProfile />
    </VStack>
  );
}
