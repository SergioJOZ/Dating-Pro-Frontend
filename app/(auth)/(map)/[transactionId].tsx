import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import auth from "@react-native-firebase/auth";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import MapViewDirections from "react-native-maps-directions";

import { Button, ButtonText } from "@/components/ui/button";
import useUser from "@/hooks/useUser";
import FinishHiringDialog from "@/components/ui/finishhiring-dialog/FinishHiringDialog";
export default function Map() {
  const { user, authUser } = useUser();
  const [clientUser, setClientUser] = useState<any>();
  const [serverUser, setServerUser] = useState<any>();
  const { transactionId } = useLocalSearchParams();
  const [showFinishHiringDialog, setShowFinishHiringDialog] = useState(false);

  useEffect(() => {
    if (!authUser) return;
    console.log("hola");
    const fetchUsers = async () => {
      const usersTransaction = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/transactions/transactionId/${transactionId}`
      );

      const clientUser = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/id/${usersTransaction.data[0].senderId}`
      );

      const serverUser = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/id/${usersTransaction.data[0].receiverId}`
      );

      setClientUser(clientUser.data);
      setServerUser(serverUser.data);
    };

    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      {user && user.role === "server" && (
        <View className="flex-1 flex-row gap-4 pl-12 absolute top-4 z-50">
          <Button
            action="positive"
            onPress={() => setShowFinishHiringDialog(true)}
          >
            <ButtonText>Finalizar servicio</ButtonText>
          </Button>
        </View>
      )}
      {clientUser && serverUser && (
        <MapView
          style={styles.map}
          initialRegion={
            clientUser === authUser?.uid
              ? {
                  latitude: serverUser.address.latitude,
                  longitude: serverUser.address.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : {
                  latitude: clientUser.address.latitude,
                  longitude: clientUser.address.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
          }
          showsUserLocation={true}
          followsUserLocation={true}
        >
          <Marker key={clientUser.id} coordinate={clientUser.address} />
          <Marker key={serverUser.id} coordinate={serverUser.address} />
          <MapViewDirections
            origin={clientUser.address}
            destination={serverUser.address}
            apikey="AIzaSyCR5r_fMK-wrQjIfg7PLt3CsETUDdYHKdk"
            strokeWidth={3}
            strokeColor="blue"
          />
          <FinishHiringDialog
            finishHiringDialog={showFinishHiringDialog}
            setFinishHiringDialog={setShowFinishHiringDialog}
            transactionId={transactionId}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
});
