import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import axios from "axios";
import auth from "@react-native-firebase/auth";
export default function useLocation() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [latitude, setLatitude] = useState<any>(null);
  const [longitude, setLongitude] = useState<any>(null);
  const [actualLocation, setActualLocation] = useState<any>();
  const authUser = auth().currentUser;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Habilita los permisos de localización para usar la app");
      } else {
        //Actualiza la ubicacion cada TimeInterval milisegundos si la distancia es mayor a distanceInterval (distancia en metros)
        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            setLocation(location);
            console.log(
              "New location update: " +
                location.coords.latitude +
                ", " +
                location.coords.longitude
            );
          }
        );
        return () => locationSubscription.remove();
      }
    })();
  }, []);

  useEffect(() => {
    async function geocodedLocation() {
      if (location) {
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);

        const updateUserLocation = await axios.put(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/address/${authUser?.uid}`,
          {
            address: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          }
        );

        const response = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setActualLocation(response);
      }
    }
    geocodedLocation();
  }, [location]);

  return { errorMsg, location, latitude, longitude, actualLocation };
}
