import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DevicesScreen from "@/screens/DevicesScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type DevicesStackParamList = {
  Devices: undefined;
};

const Stack = createNativeStackNavigator<DevicesStackParamList>();

export default function DevicesStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          headerTitle: "WiFi Cihazları",
        }}
      />
    </Stack.Navigator>
  );
}
