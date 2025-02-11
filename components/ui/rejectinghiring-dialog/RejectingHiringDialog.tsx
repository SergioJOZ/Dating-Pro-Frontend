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
import useUser from "@/hooks/useUser";

export default function RejectingHiringDialog({
  showRejectingHiringDialog,
  setShowRejectingHiringDialog,
  transactionId,
  userId,
}: any) {
  const { user } = useUser();
  const handleClose = () => setShowRejectingHiringDialog(false);
  const toast = useToast();
  const [toastId, setToastId] = useState(0);

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
          <Toast id={uniqueToastId} action={"warning"}>
            <ToastTitle>Contrato cancelado</ToastTitle>
            <ToastDescription>Has pagado con exito</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const handleConfirm = async () => {
    try {
      if (!user) return;

      //Update contract status
      //Server
      const updatePendingContract = await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/pendingContract/${userId}`,
        {
          pendingContract: false,
        }
      );

      //Client
      const updateClientContract = await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/pendingContract/${user.id}`,
        {
          pendingContract: false,
        }
      );

      const response = axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/transactions/status/${transactionId}`,
        {
          status: "rejected",
        }
      );

      handleToast();
      setShowRejectingHiringDialog(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={showRejectingHiringDialog}
        onClose={handleClose}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Cancelar contrato?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text>
              Al cancelar, el usuario podra volver a enviarte una solicitud.
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
