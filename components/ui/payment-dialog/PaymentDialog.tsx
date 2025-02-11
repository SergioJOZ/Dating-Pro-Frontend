import { Text } from "@/components/ui/text";
import React, { useEffect, useState } from "react";
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
import { Input, InputField } from "../input";
import { initStripe, useStripe } from "@stripe/stripe-react-native";
import { Alert } from "react-native";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "../select";
import { Toast, ToastDescription, ToastTitle, useToast } from "../toast";
export default function PaymentDialog({
  showPaymentDialog,
  setShowPaymentDialog,
  user,
}: any) {
  const handleClose = () => setShowPaymentDialog(false);
  const [invalidAmount, setInvalidAmount] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [amount, setAmount] = useState("500");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
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
            <ToastTitle>Recarga exitosa</ToastTitle>
            <ToastDescription>
              Has recargado tu cuenta con exito
            </ToastDescription>
          </Toast>
        );
      },
    });
  };

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/payment-sheet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: Number(amount) * 1.099 }),
      }
    );
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Dating Pro",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: user?.name,
      },
    });
    if (error) {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await initializePaymentSheet();

      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        // El pago se completo con exito

        const userAmount = Number(amount) / 100;

        const updateUserBalance = await axios.put(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/balance/${user.id}`,
          {
            balance: Number(user.balance) + userAmount,
          }
        );
        handleToast();
        router.replace("/(auth)/(home)");
        setShowPaymentDialog(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertDialog isOpen={showPaymentDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              ¿Cuánto quieres recargar?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text>Se cobrará un 9.9% de comisión en tu recarga</Text>
            <Select onValueChange={(e) => setAmount(e)}>
              <SelectTrigger variant="outline" size="md">
                <SelectInput placeholder="Selecciona un monto" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="5$" value="500" />
                  <SelectItem label="10$" value="1000" />
                  <SelectItem label="20$" value="2000" />
                  <SelectItem label="50$" value="5000" />
                  <SelectItem label="100$" value="10000" />
                </SelectContent>
              </SelectPortal>
            </Select>
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
            <Button size="sm" onPress={handleConfirm} disabled={!loading}>
              <ButtonText>Confirmar</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
