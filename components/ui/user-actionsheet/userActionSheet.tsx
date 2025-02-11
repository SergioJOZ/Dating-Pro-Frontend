import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../actionsheet";
import axios from "axios";
import { Spinner } from "../spinner";
import { Avatar, AvatarFallbackText, AvatarImage } from "../avatar";
import { Box } from "../box";
import { Button, ButtonText } from "../button";
import * as Location from "expo-location";
import HireDialog from "../hire-dialog/HireDialog";
import useUser from "@/hooks/useUser";
export default function UserActionSheet({
  userId,
  setUserId,
  showActionSheet,
  setShowActionSheet,
}: any) {
  const { user } = useUser();
  const [userDB, setUserDB] = useState<any>();
  const [reversedAddress, setReversedAddress] = useState<any>();
  const [showHireDialog, setShowHireDialog] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/id/${userId}`
      );
      setUserDB(response.data);

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: response.data.address.latitude,
        longitude: response.data.address.longitude,
      });

      setReversedAddress(reverseGeocode[0]);
    };

    fetchUser();
  }, []);
  const handleClose = () => {
    setUserId(null);
    setShowActionSheet(false);
  };

  const handleHireDialog = () => {
    setShowHireDialog(true);
  };

  return (
    <>
      <View>
        {userDB ? (
          <Actionsheet
            isOpen={showActionSheet}
            onClose={handleClose}
            snapPoints={[70]}
          >
            <ActionsheetBackdrop />
            <ActionsheetContent>
              <Avatar size="2xl">
                <AvatarFallbackText>{userDB.name}</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/${userDB.profilePic}`,
                  }}
                />
              </Avatar>
              <Text className="text-2xl text-white">{userDB.name}</Text>

              {userDB.role === "server" && (
                <Box className="flex flex-row gap-2">
                  <Text className="text-white">Costo</Text>
                  <Text className="text-white">
                    {userDB.price === "0"
                      ? "Oferta lo que quieras"
                      : userDB.price}
                  </Text>
                </Box>
              )}
              <Box className="flex w-full items-start justify-start pr-14 pt-6 ">
                <Text className="font-bold text-lg text-white">
                  Descripcion
                </Text>
                <Text className="text-white">
                  {userDB.bio || "No hay descripcion"}
                </Text>
              </Box>

              <Box className="flex w-full items-start justify-start pr-14 pt-10">
                <Text className="font-bold text-white text-lg">Ubicacion</Text>
                {reversedAddress ? (
                  <Text className="text-white">
                    {reversedAddress.formattedAddress}
                  </Text>
                ) : (
                  <Spinner />
                )}
              </Box>
              <Box className="flex-1 justify-end pb-12">
                {userDB.pendingContract && user && user.pendingContract ? (
                  <Text className="text-white">
                    Tienes un contrato pendiente, por favor, finalizalo para
                    poder contratar a otros o ser contratado.
                  </Text>
                ) : userDB.role === "server" ? (
                  <Button variant="outline" onPress={handleHireDialog}>
                    <ButtonText>Contratame</ButtonText>
                  </Button>
                ) : (
                  <Text className="text-white">
                    Espera que un usuario te contrate
                  </Text>
                )}
              </Box>
            </ActionsheetContent>
          </Actionsheet>
        ) : null}
        {showHireDialog && (
          <HireDialog
            userId={userId}
            userName={user?.name}
            userCost={100}
            showHireDialog={showHireDialog}
            setShowHireDialog={setShowHireDialog}
            setShowActionSheet={setShowActionSheet}
          />
        )}
      </View>
    </>
  );
}
