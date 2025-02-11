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
import { Toast, ToastDescription, ToastTitle, useToast } from "../toast";
import { useRouter } from "expo-router";

export default function ClientPayDialog({
  showClientPayDialog,
  setShowClientPayDialog,
  transactionId,
  transactionAmount,
  userId,
}: any) {
  const { user } = useUser();
  const handleClose = () => setShowClientPayDialog(false);
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
            <ToastTitle>Pago exitoso</ToastTitle>
            <ToastDescription>Has pagado con exito</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const handleConfirm = async () => {
    try {
      //Logica de pago
      //Check if user has enough balance
      if (Number(user.balance) < Number(transactionAmount)) {
        alert("No tienes suficiente balance para realizar el pago");
        return;
      }

      //If user has enough balance, then update users balance
      //Update client balance (decrease)
      const updateUserBalance = await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/balance/${user.id}`,
        {
          balance: Number(user.balance) - Number(transactionAmount),
        }
      );

      // Update server balance (increase)
      const updateServerBalance = await axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/balance/${userId}`,
        {
          balance: Number(user.balance) + Number(transactionAmount),
        }
      );

      // Set transaction status to paid
      const response = axios.put(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/transactions/status/${transactionId}`,
        {
          status: "paid",
        }
      );

      handleToast();
      setShowClientPayDialog(false);
      router.replace("/(auth)/home");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertDialog isOpen={showClientPayDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Deseas proceder con el pago?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text>Al aceptar, se procedera con el pago de la transaccion.</Text>
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
