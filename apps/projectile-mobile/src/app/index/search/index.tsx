import { Host, Text } from "@expo/ui";
import { Stack } from "expo-router";

export default function Admin() {
  return <>
    <Stack.Screen options={{ title: "Search" }} />
    <Stack.SearchBar placement={"automatic"} placeholder="Search" onChangeText={() => {}} />
    <Host><Text>Admin</Text></Host>
  </>;
}