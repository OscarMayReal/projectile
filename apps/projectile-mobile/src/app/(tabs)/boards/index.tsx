import { Host, Text } from "@expo/ui";
import { Stack } from "expo-router";

export default function Boards() {
  return (
    <>
      <Stack.Screen options={{title: "Boards"}} />
      <Host>
        <Text>boards</Text>
      </Host>
    </>
  );
}
