import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Box } from "../box";
import { Avatar, AvatarFallbackText, AvatarImage } from "../avatar";
import { Spinner } from "../spinner";
import { Pressable } from "../pressable";
import TransactionSheet from "../transaction-actionsheet/TransactionSheet";
import { useFocusEffect } from "expo-router";

export default function TransactionCard({ userId, transactionId }: any) {
  const [user, setUser] = useState<any>();
  const [transaction, setTransaction] = useState<any>();
  const [showTransactionSheet, setShowTransactionSheet] = useState(false);
  const getUser = async () => {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/id/${userId}`
    );

    setUser(response.data);
  };

  const getTransaction = async () => {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/transactions/id/${transactionId}`
    );

    setTransaction(response.data[0]);
  };

  const handleOpenTransactionSheet = () => {
    setShowTransactionSheet(true);
  };

  useFocusEffect(
    useCallback(() => {
      try {
        getUser();
        getTransaction();
      } catch (error) {
        console.log(error);
      }
    }, [])
  );

  return (
    <View>
      {user && transaction ? (
        <Pressable onPress={handleOpenTransactionSheet} className="p-4">
          <Box className="flex-1 flex-row gap-4">
            <Avatar size="lg">
              <AvatarImage
                source={{
                  uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/${user.profilePic}`,
                }}
              />
              <AvatarFallbackText>{user.name}</AvatarFallbackText>
            </Avatar>
            <Box>
              <Text className="text-white font-bold text-lg">{user.name}</Text>
              <Text className="text-md text-white">
                {transaction.status === "pending"
                  ? "Pendiente"
                  : transaction.status === "paid"
                  ? "Pagada"
                  : transaction.status === "approved"
                  ? "Aprobada"
                  : transaction.status === "finished"
                  ? "Finalizada"
                  : "Rechazada"}
              </Text>
            </Box>
          </Box>
        </Pressable>
      ) : (
        <Spinner />
      )}
      {transaction && (
        <TransactionSheet
          showTransactionSheet={showTransactionSheet}
          setShowTransactionSheet={setShowTransactionSheet}
          transaction={transaction}
          user={user}
        />
      )}
    </View>
  );
}
