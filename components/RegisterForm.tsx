import React, { useState } from "react";
import { Input, InputField } from "./ui/input";
import { Button, ButtonText } from "./ui/button";
import { VStack } from "./ui/vstack";
import { Text } from "react-native";
import auth from "@react-native-firebase/auth";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "./ui/select";
import axios from "axios";
import { Toast, ToastDescription, ToastTitle, useToast } from "./ui/toast";
import { router } from "expo-router";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "./ui/form-control";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const toast = useToast();
  const [toastId, setToastId] = useState(0);
  const [error, setError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
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
            <ToastTitle>{"Registro exitoso"}</ToastTitle>
            <ToastDescription>"Usuario registrado con éxito"</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const handleRegister = async () => {
    try {
      if (!name || !role || !email || !password) {
        setNameError(true);
        setEmailError(true);
        setPasswordError(true);
        throw new Error("Por favor, completa todos los campos");
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

      if (!passwordRegex.test(password)) {
        setPasswordError(true);
        throw new Error(
          "La contraseña debe tener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial"
        );
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError(true);
        setPasswordError(true);
        throw new Error("Las contraseñas no coinciden");
      }

      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user.uid;

      console.log(userCredential);

      const user = {
        id: uid,
        email,
        name,
        role,
      };

      const createDBUser = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users`,
        user
      );
      handleToast();
    } catch (error: any) {
      setError(true);
      if (error.message) {
        if (error.message.includes("email")) {
          setEmailError(true);
        }
      }
    }
  };

  return (
    <VStack space="sm" className="bg-background-50 pl-6 pr-6 flex-1 ">
      <FormControl isInvalid={nameError} className="pb-10" size="md">
        <FormControlLabel>
          <FormControlLabelText>Nombre completo</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Nombre completo"
            type="text"
            variant="outline"
            value={name}
            onChangeText={(e) => setName(e)}
          />
        </Input>
      </FormControl>

      <Select className="pb-10" onValueChange={(e) => setRole(e)}>
        <SelectTrigger size="md" variant="outline">
          <SelectInput
            className="pt-2"
            placeholder="Tipo de usuario"
          ></SelectInput>
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem label="Cliente" value="client" />
            <SelectItem label="Servidora" value="server" />
          </SelectContent>
        </SelectPortal>
      </Select>

      <FormControl isInvalid={emailError} size="md">
        <FormControlLabel>
          <FormControlLabelText>Correo electronico</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Correo electronico"
            type="text"
            variant="outline"
            value={email}
            onChangeText={(e) => setEmail(e)}
          />
        </Input>
      </FormControl>

      {emailError && (
        <Text className="text-white pb-10">
          El correo es invalido o ya esta en uso.
        </Text>
      )}

      <FormControl isInvalid={passwordError} size="md">
        <FormControlLabel>
          <FormControlLabelText>Contraseña</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Contraseña"
            type="password"
            variant="outline"
            value={password}
            onChangeText={(e) => setPassword(e)}
          />
        </Input>
      </FormControl>

      <Text className="text-white">
        La contraseña debe tener al menos una letra minúscula, una letra
        mayúscula, un número y un carácter especial, y al menos 6 caracteres
      </Text>

      <FormControl
        isInvalid={confirmPasswordError}
        className="pb-10 pt-5"
        size="md"
      >
        <FormControlLabel>
          <FormControlLabelText>Confirmar contraseña</FormControlLabelText>
        </FormControlLabel>
        <Input>
          <InputField
            placeholder="Confirma tu contraseña"
            type="password"
            variant="outline"
            value={confirmPassword}
            onChangeText={(e) => setConfirmPassword(e)}
          />
        </Input>
      </FormControl>

      <Button onPress={handleRegister}>
        <ButtonText>Registrarse</ButtonText>
      </Button>
    </VStack>
  );
}
