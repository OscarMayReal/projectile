import { Host, Text } from "@expo/ui";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function Feed() {
  return <><Stack.Screen options={{ title: "Feed" }} /><Host><Text>Feed</Text></Host></>;
}