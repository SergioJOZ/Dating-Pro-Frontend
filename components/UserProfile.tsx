import { View, Text, Alert } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
} from "./ui/avatar";
import { Box } from "./ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import auth from "@react-native-firebase/auth";
import { useFocusEffect, useRouter } from "expo-router";
import PaymentDialog from "./ui/payment-dialog/PaymentDialog";
import axios from "axios";
import { Input, InputField } from "./ui/input";
import * as ImagePicker from "expo-image-picker";
import { Toast, ToastDescription, ToastTitle, useToast } from "./ui/toast";
import { Pressable } from "./ui/pressable";
import ChangeBioActionSheet from "./ui/changebio-actionsheet/ChangeBioActionSheet";

export default function UserProfile() {
  const authUser = auth().currentUser;
  const [user, setUser] = useState<any>();
  const router = useRouter();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isChangingPrice, setIsChangingPrice] = useState(false);
  const [price, setPrice] = useState("");
  const [bio, setBio] = useState();
  const [showChangeBioSheet, setShowChangeBioSheet] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>();
  const [isSelectedImage, setIsSelectedImage] = useState(false);
  const toast = useToast();
  const [toastId, setToastId] = useState(0);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setIsSelectedImage(true);
    } else {
      alert("Error al seleccionar la imagen");
    }
  };

  const handleToast = () => {
    if (!toast.isActive(toastId)) {
      showNewToast();
    }
  };

  const showNewToast = () => {
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: newId,
      placement: "bottom",
      duration: 4000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast id={uniqueToastId} action={"success"}>
            <ToastTitle>Actualizado</ToastTitle>
            <ToastDescription>
              Has actualizado tu precio por contrato con exito
            </ToastDescription>
          </Toast>
        );
      },
    });
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = () => {
    setShowPaymentDialog(true);
  };

  const fetchUser = async () => {
    try {
      if (!authUser) {
        return;
      }
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/id/${authUser.uid}`
      );

      if (response.data.price) {
        setPrice(response.data.price);
      }

      if (response.data.bio) {
        setBio(response.data.bio);
      }

      if (response.data.profilePic) {
        setSelectedImage({
          uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/${response.data.profilePic}`,
        });
      }

      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleSaveChanges = async () => {
    try {
      //If there is not a bio or a selected image, show an alert and return, finishing the execution of the function
      if (!bio && !selectedImage) {
        Alert.alert(
          "Faltan campos",
          "Por favor, cambia la descripcion o tu foto de perfil"
        );
        return;
      }
      //Create form data
      const formData = new FormData();

      //If there is a bio, append it to the form data
      if (bio) {
        formData.append("bio", bio);
      }

      //If there is a selected image, append it to the form data

      if (selectedImage) {
        formData.append("profilePic", {
          name: selectedImage.fileName,
          uri: selectedImage.uri,
          type: selectedImage.mimeType,
        });
      }

      await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/${authUser?.uid}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data, headers) => {
            return data;
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePrice = async () => {
    if (!authUser) return;
    try {
      await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/price/${authUser.uid}`,
        { price }
      );
      handleToast();
      setPrice(price);
      setIsChangingPrice(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditBio = () => {
    setShowChangeBioSheet(true);
  };

  return (
    <View className="bg-background-50 h-full pt-4 pl-2 pr-6">
      {user && (
        <Box>
          <Pressable className="flex items-center" onPress={pickImageAsync}>
            <Avatar size="xl">
              <AvatarFallbackText>{user.name}</AvatarFallbackText>
              {selectedImage && (
                <AvatarImage
                  source={{
                    uri: selectedImage.uri,
                  }}
                />
              )}
            </Avatar>
            <Text className="text-3xl pt-3 text-white">{user.name}</Text>
          </Pressable>

          <Box className="pt-4 pl-3 flex flex-row gap-10">
            {/*<Box>
              <Text className="text-3xl text-white">Calificaciones</Text>
              <Text className="text-2xl text-white">
                {user.ratings ? user.ratings : 0}
              </Text>
            </Box>
            <Button
              variant="outline"
              onPress={() => alert("Calificaciones...")}
            >
              <ButtonText className="text-white">Ver calificaciones</ButtonText>
            </Button>
            */}
          </Box>

          <Box className="pt-4 pl-3 flex flex-row gap-10 ">
            <Box>
              <Text className="text-3xl text-white">Balance</Text>
              <Text className="text-2xl text-white">${user.balance}</Text>
            </Box>
            {user.role === "client" && (
              <Button variant="outline" onPress={handlePayment}>
                <ButtonText className="">Recargar</ButtonText>
              </Button>
            )}
          </Box>

          <Box className="pt-4 pl-3">
            <Text className="text-3xl text-white">Email</Text>
            <Text className="text-2xl text-white">{authUser?.email}</Text>
          </Box>

          {user.role === "server" && !isChangingPrice ? (
            <Box className="pt-4 pl-3 flex flex-row">
              <Box>
                <Text className="text-3xl text-white">Precio por contrato</Text>
                <Text className="text-2xl text-white">${price || 0}</Text>
              </Box>
              <Box className="pl-4 pt-4">
                <Button
                  onPress={() => setIsChangingPrice(true)}
                  variant="outline"
                >
                  <ButtonText className="">Cambiar precio</ButtonText>
                </Button>
              </Box>
            </Box>
          ) : (
            user.role === "server" && (
              <Box className="pt-4 pl-3 flex flex-row">
                <Box>
                  <Text className="text-3xl text-white">
                    Precio por contrato
                  </Text>
                  <Input variant="underlined" size="xl">
                    <InputField
                      placeholder={`${user.price}` || "0"}
                      value={`${price}`}
                      className="text-white"
                      onChangeText={(e) => setPrice(e)}
                      keyboardType="numeric"
                    />
                  </Input>
                </Box>
                <Box className="pl-4 pt-4">
                  <Button onPress={handleChangePrice} variant="outline">
                    <ButtonText className="">Cambiar precio</ButtonText>
                  </Button>
                </Box>
              </Box>
            )
          )}

          <Box className="pt-6 pl-3 flex flex-row ">
            <Text className="text-3xl text-white">Descripcion</Text>
            <Box className="pl-4">
              <Button variant="outline">
                <ButtonText className="" onPress={handleEditBio}>
                  Ver o cambiar descripcion
                </ButtonText>
              </Button>
            </Box>
          </Box>

          <Box className="pt-16 pl-3 pb-2">
            <Button onPress={handleSaveChanges} variant="outline">
              <ButtonText className="">Guardar cambios</ButtonText>
            </Button>
          </Box>

          <Box className="pt-64 pl-32 pr-32">
            <Button onPress={handleSignOut}>
              <ButtonText className="">Cerrar sesion</ButtonText>
            </Button>
          </Box>

          <PaymentDialog
            showPaymentDialog={showPaymentDialog}
            setShowPaymentDialog={setShowPaymentDialog}
            user={user}
          />

          <ChangeBioActionSheet
            showChangeBioSheet={showChangeBioSheet}
            setShowChangeBioSheet={setShowChangeBioSheet}
            bio={bio}
            setBio={setBio}
          />
        </Box>
      )}
    </View>
  );
}
