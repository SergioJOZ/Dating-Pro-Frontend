import React, { useState } from "react";
import { Input, InputField } from "./ui/input";
import { Button, ButtonText } from "./ui/button";
import { VStack } from "./ui/vstack";
import { Text } from "react-native";
import auth from "@react-native-firebase/auth";

import { Link } from "expo-router";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
    } catch (error: any) {
      setError("Correo electronico o contraseña incorrectos");
    }
  };

  return (
    <VStack space="md" className="pl-6 pr-6 flex-1  bg-background-50">
      <Input>
        <InputField
          placeholder="Correo electronico"
          type="text"
          variant="outline"
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
      </Input>

      <Input>
        <InputField
          placeholder="Contraseña"
          type="password"
          variant="outline"
          value={password}
          onChangeText={(e) => setPassword(e)}
        />
      </Input>

      {error && <Text className="text-white text-md">{error}</Text>}

      <Button onPress={handleLogin}>
        <ButtonText>Iniciar sesion</ButtonText>
      </Button>

      <Text className="pt-6 text-black dark:text-white">
        ¿No tienes una cuenta?
      </Text>
      <Link href="./register" asChild>
        <Button variant="outline">
          <ButtonText>Registrate</ButtonText>
        </Button>
      </Link>
    </VStack>
  );
}
