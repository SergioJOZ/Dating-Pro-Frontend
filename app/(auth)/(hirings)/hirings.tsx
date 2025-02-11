import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import axios from "axios";
import TransactionCard from "@/components/ui/transaction-card/TransactionCard";
import { Spinner } from "@/components/ui/spinner";
import { useFocusEffect } from "expo-router";

export default function HiringsPage() {
  const { authUser, user } = useUser();
  const [transactions, setTransactions] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getTransactions = async () => {
    setIsLoading(true);
    if (user && user.role === "client") {
      try {
        const transactions = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/transactions/client/userId/${user?.id}`
        );

        //Retorna userTransactions, que cada una tiene senderId, receiverId y transactionId
        setTransactions(transactions.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else if (user && user.role === "server") {
      try {
        const transactions = await axios.get(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/transactions/server/userId/${user?.id}`
        );
        setTransactions(transactions.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getTransactions();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      getTransactions();
    }, [user])
  );

  return (
    <View className="flex-1 bg-background-50">
      {!isLoading ? (
        <>
          <View className="z-50">
            <Text className="text-3xl font-bold text-white pl-4 mt-4">
              {user && user.role === "client"
                ? "Contrataciones enviadas"
                : "Contrataciones recibidas"}
            </Text>
          </View>
          <View className="absolute inset-0 top-16 left-3 right-3 bottom-4">
            {user && user.role === "client" && transactions ? (
              <FlatList
                data={transactions}
                renderItem={({ item, index, separators }) => (
                  <TransactionCard
                    key={index}
                    userId={item.receiverId}
                    transactionId={item.transactionId}
                  />
                )}
                ItemSeparatorComponent={() => <View className="h-2" />}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            ) : user && user.role === "server" && transactions ? (
              <FlatList
                data={transactions}
                renderItem={({ item, index, separators }) => (
                  <TransactionCard
                    key={index}
                    userId={item.senderId}
                    transactionId={item.transactionId}
                    status={item.status}
                  />
                )}
                ItemSeparatorComponent={() => <View className="h-2" />}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            ) : null}
            {!isLoading && !transactions && (
              <Text className="text-3xl font-bold text-white pl-4 mt-4">
                No hay contrataciones
              </Text>
            )}
          </View>
        </>
      ) : (
        <Spinner size="large" color="primary" />
      )}
    </View>
  );
}
