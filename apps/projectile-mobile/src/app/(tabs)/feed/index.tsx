import { ToolbarProjectSwitcher } from "@/components/toolbar-project-switcher";
import { Host, Text } from "@expo/ui";
import { Stack } from "expo-router";
import person_2 from "@expo/material-symbols/person_2.xml"

export default function FeedPage() {
  return (
    <>
      <Stack.Screen options={{title: "Feed"}} />
      <ToolbarProjectSwitcher />
      <Host>
        <Text>feed</Text>
      </Host>
    </>
  );
}
