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
import useUser from "@/hooks/useUser";
import { useRouter } from "expo-router";
import { Toast, ToastDescription, ToastTitle, useToast } from "../toast";

export default function FinishHiringDialog({
  finishHiringDialog,
  setFinishHiringDialog,
  transactionId,
  userId,
}: any) {
  const handleClose = () => setFinishHiringDialog(false);
  const router = useRouter();
  const { user } = useUser();
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
          <Toast id={uniqueToastId} action={"success"}>
            <ToastTitle>Contrato finalizado</ToastTitle>
            <ToastDescription>Has finalizado este contrato</ToastDescription>
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
          status: "finished",
        }
      );

      handleToast();
      setFinishHiringDialog(false);
      router.replace(`/(auth)/home`);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertDialog isOpen={finishHiringDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Quieres dar el contrato como finalizado?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text>Al aceptar, el contrato sera finalizada</Text>
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
