import { ToolbarProjectSwitcher, useProjectContext } from "@/components/toolbar-project-switcher";
import { Host, List, ListItem, Text, Icon } from "@expo/ui";
import { router, Stack, useRouter } from "expo-router";

const CHEVRON = Icon.select({
  ios: 'chevron.right',
  android: require('@expo/material-symbols/chevron_right.xml'),
});

export default function Boards() {
  const { activeProjectState } = useProjectContext()
  const router = useRouter()
  return (
    <>
      <Stack.Screen options={{title: "Boards"}} />
      <ToolbarProjectSwitcher />
      <Host style={{flex: 1}}>
        <List>
          {activeProjectState?.data?.boards.map(item => (
            <ListItem key={item.id} onPress={() => {
              router.push(`/(tabs)/boards/${item.id}` as any)
            }} supportingText={item.description} trailing={<Icon name={CHEVRON} size={14} color="gray" />}>
              <Text>{item.name}</Text>
            </ListItem>
          ))}
        </List>
      </Host>
    </>
  );
}
