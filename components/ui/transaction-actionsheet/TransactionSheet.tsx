import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../actionsheet";
import { Avatar, AvatarFallbackText, AvatarImage } from "../avatar";
import { Box } from "../box";
import { Button, ButtonText } from "../button";
import * as Location from "expo-location";
import { Spinner } from "../spinner";
import AcceptHiringDialog from "../accepthiring-dialog/AcceptHiringDialog";
import RejectingHiringDialog from "../rejectinghiring-dialog/RejectingHiringDialog";
import ClientPayDialog from "../clientpay-dialog/ClientPayDialog";
import { useRouter } from "expo-router";
import FinishHiringDialog from "../finishhiring-dialog/FinishHiringDialog";
export default function TransactionSheet({
  showTransactionSheet,
  setShowTransactionSheet,
  transaction,
  user,
}: any) {
  const [reversedGeocode, setReversedGeocoded] = useState<any>();
  const [showAcceptHiringDialog, setShowAcceptHiringDialog] = useState(false);
  const [showRejectingHiringDialog, setShowRejectingHiringDialog] =
    useState(false);
  const [showClientPayDialog, setShowClientPayDialog] = useState(false);
  const [showFinishHiringDialog, setShowFinishHiringDialog] = useState(false);
  const router = useRouter();

  const reverseAddress = async () => {
    const response = await Location.reverseGeocodeAsync({
      latitude: user.address.latitude,
      longitude: user.address.longitude,
    });

    setReversedGeocoded(response[0]);
  };

  useEffect(() => {
    reverseAddress();
  }, []);

  const onServerAcceptHiring = async () => {
    setShowAcceptHiringDialog(true);
  };

  const onServerRejectingHiring = async () => {
    setShowRejectingHiringDialog(true);
  };

  const onClientPayingHiring = async () => {
    setShowClientPayDialog(true);
  };

  const onServerFinishHiring = async () => {
    setShowFinishHiringDialog(true);
  };

  const goToMap = () => {
    setShowTransactionSheet(false);

    router.push(`/(map)/${transaction.id}`);
  };

  return (
    <View>
      {user && (
        <Actionsheet
          isOpen={showTransactionSheet}
          onClose={() => setShowTransactionSheet(false)}
          snapPoints={[70]}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <Avatar size="2xl">
              <AvatarFallbackText>{user.name}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/${user.profilePic}`,
                }}
              />
            </Avatar>

            <Box>
              <Text className="text-center text-2xl text-white">
                {user.name}
              </Text>
              {user.role === "client" ? (
                <Text className="font-bold text-white text-center text-xl">
                  Quiere pagarte: ${transaction.amount}
                </Text>
              ) : (
                <Text className="font-bold text-center text-white text-xl">
                  Vas a pagarle: ${transaction.amount}
                </Text>
              )}
            </Box>

            <Box className="pt-6">
              {reversedGeocode ? (
                <Text className="text-xl text-white">
                  Se encuentra en: {reversedGeocode.formattedAddress}
                </Text>
              ) : (
                <Spinner size={"small"} />
              )}
            </Box>

            {transaction.status === "pending" && user.role === "client" && (
              <Box className="flex-1 flex-row justify-center items-end pb-12 gap-6">
                <Button action="negative" onPress={onServerRejectingHiring}>
                  <ButtonText>Rechazar contratacion</ButtonText>
                </Button>
                <Button action="positive" onPress={onServerAcceptHiring}>
                  <ButtonText>Aceptar contratacion</ButtonText>
                </Button>
              </Box>
            )}

            {transaction.status === "pending" && user.role === "server" && (
              <Box className="flex-1 flex-row justify-center items-end pb-12 gap-6">
                <Text className="text-white">
                  Espera que la servidora acepte o rechace el contrato.
                </Text>
              </Box>
            )}

            {transaction.status === "rejected" && (
              <Box className="flex-1 flex-row justify-center items-end pb-12 gap-6">
                <Text className="text-white">
                  El contrato ha sido rechazado o cancelado.
                </Text>
              </Box>
            )}

            {transaction.status === "paid" && user.role === "client" ? (
              <Box className="flex-1 flex-row justify-center items-end pb-12 gap-6">
                <Button onPress={goToMap}>
                  <ButtonText>Ver ubicacion en el mapa</ButtonText>
                </Button>
                <Button action="positive" onPress={onServerFinishHiring}>
                  <ButtonText>Finalizar contratacion</ButtonText>
                </Button>
              </Box>
            ) : (
              transaction.status === "approved" &&
              user.role === "client" && (
                <Box className="flex-1 flex-row justify-center items-end pb-12 gap-6">
                  <Button onPress={goToMap}>
                    <ButtonText>Ver ubicacion en el mapa</ButtonText>
                  </Button>
                  <Button action="negative" onPress={onServerRejectingHiring}>
                    <ButtonText>Cancelar contratacion</ButtonText>
                  </Button>
                </Box>
              )
            )}

            {transaction.status === "paid" && user.role === "server" ? (
              <Box className="flex-1 justify-end items-center pb-12 gap-6">
                <Text className="text-white">
                  La servidora marcara como finalizado el contrato una vez se
                  haya completado el servicio.
                </Text>
                <Button onPress={goToMap}>
                  <ButtonText>Ver ubicacion en el mapa</ButtonText>
                </Button>
              </Box>
            ) : (
              transaction.status === "approved" &&
              user.role === "server" && (
                <Box className="flex-1 flex-row justify-center items-end pb-12 gap-6">
                  <Button action="negative" onPress={onServerRejectingHiring}>
                    <ButtonText>Cancelar contratacion</ButtonText>
                  </Button>
                  <Button action="positive" onPress={onClientPayingHiring}>
                    <ButtonText>Pagar</ButtonText>
                  </Button>
                </Box>
              )
            )}

            {transaction.status === "finished" && (
              <Box className="flex-1 flex-row justify-center items-end pb-12 gap-6">
                <Text className="text-white">
                  El contrato ha sido finalizado.
                </Text>
              </Box>
            )}

            <AcceptHiringDialog
              showAcceptHiringDialog={showAcceptHiringDialog}
              setShowAcceptHiringDialog={setShowAcceptHiringDialog}
              transactionId={transaction.id}
            />

            <RejectingHiringDialog
              showRejectingHiringDialog={showRejectingHiringDialog}
              setShowRejectingHiringDialog={setShowRejectingHiringDialog}
              transactionId={transaction.id}
              userId={user.id}
            />

            <ClientPayDialog
              showClientPayDialog={showClientPayDialog}
              setShowClientPayDialog={setShowClientPayDialog}
              transactionId={transaction.id}
              transactionAmount={transaction.amount}
              userId={user.id}
            />

            <FinishHiringDialog
              finishHiringDialog={showFinishHiringDialog}
              setFinishHiringDialog={setShowFinishHiringDialog}
              transactionId={transaction.id}
              userId={user.id}
            />
          </ActionsheetContent>
        </Actionsheet>
      )}
    </View>
  );
}
