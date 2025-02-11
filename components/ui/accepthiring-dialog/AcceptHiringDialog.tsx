import { View } from "react-native";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../alert-dialog";
import { Heading } from "../heading";
import { Button, ButtonText } from "../button";
import axios from "axios";
import { Toast, ToastDescription, ToastTitle, useToast } from "../toast";
import { useRouter } from "expo-router";

export default function AcceptHiringDialog({
  showAcceptHiringDialog,
  setShowAcceptHiringDialog,
  transactionId,
}: any) {
  const handleClose = () => setShowAcceptHiringDialog(false);
  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const router = useRouter();

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
            <ToastTitle>Contrato aceptado</ToastTitle>
            <ToastDescription>Has aceptado el contrato</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const handleConfirm = async () => {
    try {
      const response = axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/transactions/status/${transactionId}`,
        {
          status: "approved",
        }
      );

      handleToast();
      setShowAcceptHiringDialog(false);
      router.replace(`/(auth)/home`);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={showAcceptHiringDialog}
        onClose={handleClose}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Aceptas el contrato?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text>
              Al aceptar, tendras que esperar a que el usuario pague, tienes
              hasta ese momento para cancelar el contrato, una vez pagado, no
              podras cancelarlo.
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
