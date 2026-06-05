import { ToolbarProjectSwitcher } from "@/components/toolbar-project-switcher";
import { Host, Text } from "@expo/ui";
import { Stack } from "expo-router";


export default function Reports() {
  return (
    <>
      <Stack.Screen options={{title: "Reports"}} />
      <ToolbarProjectSwitcher />
      <Host>
        <Text>reports</Text>
      </Host>
    </>
  );
}
