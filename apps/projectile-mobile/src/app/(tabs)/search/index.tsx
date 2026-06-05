import { ToolbarProjectSwitcher } from "@/components/toolbar-project-switcher";
import { Host, Text } from "@expo/ui";
import { Stack } from "expo-router";

export default function Search() {
  return (
    <>
      <Stack.Screen options={{ title: "Search" }} />
      <Stack.SearchBar placement="automatic" placeholder="Search" onChangeText={() => {}} />
      <ToolbarProjectSwitcher />
      <Host>
        <Text>Search</Text>
      </Host>
    </>
  );
}
