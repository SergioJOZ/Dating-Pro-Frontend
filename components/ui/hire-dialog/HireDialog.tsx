import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import * as Notifications from "expo-notifications";
import axios from "axios";
import useUser from "@/hooks/useUser";
import { Toast, ToastDescription, ToastTitle, useToast } from "../toast";
import { Input, InputField } from "../input";
import { Alert } from "react-native";
export default function HireDialog({
  showHireDialog,
  setShowHireDialog,
  setShowActionSheet,
  userName,
  userCost,
  userId,
}: any) {
  const router = useRouter();
  const handleClose = () => setShowHireDialog(false);
  const { authUser, user } = useUser();
  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const [offering, setOffering] = useState("");
  const handleConfirm = async () => {
    if (!offering || !authUser) {
      Alert.alert("Oferta rechazada", "No has ofrecido nada");
      return;
    }
    try {
      //Update pending contract to true
      //Server
      const updatePendingContract = await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/pendingContract/${userId}`,
        {
          pendingContract: true,
        }
      );

      //Client
      const updateClientContract = await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/pendingContract/${authUser.uid}`,
        {
          pendingContract: true,
        }
      );

      const newTransaction = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/transactions`,
        {
          senderId: authUser.uid,
          receiverId: userId,
          amount: offering,
        }
      );
    } catch (error: any) {
      console.log(error);
    }

    handleToast();

    setShowHireDialog(false);
    setShowActionSheet(false);

    router.push("./(hirings)/hirings");
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
            <ToastTitle>Peticion de contratacion enviada</ToastTitle>
            <ToastDescription>Por favor, espere respuesta</ToastDescription>
          </Toast>
        );
      },
    });
  };

  return (
    <>
      <AlertDialog isOpen={showHireDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              ¿Cuánto quieres ofrecer a {userName}? Tiene un costo minimo por
              contrato de ${userCost}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Input>
              <InputField
                placeholder="Oferta"
                value={offering}
                onChangeText={(e) => setOffering(e)}
                keyboardType="numeric"
              />
            </Input>

            <Text size="sm">
              Si ofreces menos, es menos probable que acepten. Al aceptar, se le
              notificará a {userName}, y tendrás que esperar hasta que acepte tu
              solicitud.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button size="sm" onPress={handleConfirm}>
              <ButtonText>Confirmar</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
