import { View, Text } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Box } from "@/components/ui/box";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";

import { Pressable } from "./ui/pressable";
import UserActionSheet from "./ui/user-actionsheet/userActionSheet";
import auth from "@react-native-firebase/auth";
import useLocation from "@/hooks/useLocation";
import useUser from "@/hooks/useUser";
import { Spinner } from "./ui/spinner";
import { getDistance } from "geolib";
import { useFocusEffect } from "expo-router";

export default function Home() {
  const [users, setUsers] = useState<any>();
  const { authUser, user } = useUser();
  const [userId, setUserId] = useState<any>();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const { latitude, longitude, actualLocation, errorMsg } = useLocation();
  const [noUsers, setNoUsers] = useState(false);

  const fetchUsers = async () => {
    if (!authUser) return;

    if (user && user.role === "server") {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/role/client`
      );

      // `getDistance` devuelve la distancia en metros
      const nearUsers = response.data.filter((userNear: any) => {
        const distance = getDistance(
          {
            latitude: latitude,
            longitude: longitude,
          },
          {
            latitude: userNear.address.latitude,
            longitude: userNear.address.longitude,
          }
        );

        return distance <= 20000; // 20 km en metros
      });

      setUsers(nearUsers);

      if (nearUsers.length === 0) {
        setNoUsers(true);
      }
    } else if (user.role === "client") {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/role/server`
      );
      // `getDistance` devuelve la distancia en metros
      const nearUsers = response.data.filter((userNear: any) => {
        const distance = getDistance(
          {
            latitude: latitude,
            longitude: longitude,
          },
          {
            latitude: userNear.address.latitude,
            longitude: userNear.address.longitude,
          }
        );

        return distance <= 20000; // 20 km en metros
      });

      setUsers(nearUsers);

      if (nearUsers.length === 0) {
        setNoUsers(true);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [user, latitude, longitude])
  );

  return (
    <VStack className="bg-background-50 h-full">
      <Text className="text-3xl font-bold text-white pl-4 mt-4">
        {!user ? (
          <Spinner size="large" />
        ) : user.role === "server" ? (
          "Clientes cerca de ti"
        ) : (
          "Servidoras cerca de ti"
        )}
      </Text>
      <View className="flex flex-row gap-10 pt-6 flex-wrap justify-center">
        {errorMsg && <Text>{errorMsg}</Text>}
        {!errorMsg &&
          users &&
          actualLocation &&
          users.map((user: any) => (
            <Box key={user.id}>
              <Pressable
                key={user.id}
                className="flex items-center"
                onPress={() => {
                  setUserId(user.id);
                  setShowActionSheet(true);
                }}
              >
                <Avatar size="xl">
                  <AvatarFallbackText>{user.name}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/${user.profilePic}`,
                    }}
                  />
                  <AvatarBadge />
                </Avatar>
                <Text key={user.id} className="text-white">
                  {user.name}
                </Text>
              </Pressable>
            </Box>
          ))}

        {!users && <Spinner size="large" />}
        {noUsers && (
          <Text className="text-white text-xl">
            No hay usuarios cerca de ti.
          </Text>
        )}
      </View>
      {userId && (
        <UserActionSheet
          userId={userId}
          setUserId={setUserId}
          showActionSheet={showActionSheet}
          setShowActionSheet={setShowActionSheet}
        />
      )}
    </VStack>
  );
}
