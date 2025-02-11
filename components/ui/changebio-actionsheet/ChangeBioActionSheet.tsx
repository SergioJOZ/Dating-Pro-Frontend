import { View, Text } from "react-native";
import React from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "../actionsheet";
import { Textarea, TextareaInput } from "../textarea";
import { Box } from "../box";
import { Button, ButtonText } from "../button";

export default function ChangeBioActionSheet({
  showChangeBioSheet,
  setShowChangeBioSheet,
  bio,
  setBio,
}: any) {
  const onSaveBio = () => {
    setShowChangeBioSheet(false);
  };

  return (
    <View>
      <Actionsheet
        isOpen={showChangeBioSheet}
        onClose={() => setShowChangeBioSheet(false)}
        snapPoints={[50]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <Text className="text-lg font-bold pb-10 pt-6 text-white">
            Cambia tu biografia
          </Text>
          <Textarea>
            <TextareaInput
              value={bio}
              size="xl"
              placeholder="Tu descripcion va aqui..."
              onChangeText={setBio}
            />
          </Textarea>

          <Box className="pt-32 ">
            <Button onPress={onSaveBio}>
              <ButtonText>Guardar</ButtonText>
            </Button>
          </Box>
        </ActionsheetContent>
      </Actionsheet>
    </View>
  );
}
