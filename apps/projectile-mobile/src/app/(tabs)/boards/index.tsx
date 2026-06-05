import { ToolbarProjectSwitcher, useProjectContext } from "@/components/toolbar-project-switcher";
import { Host, List, ListItem, Text, Icon, BottomSheet, Column, Row, TextInput, Button, useNativeState } from "@expo/ui";
import { router, Stack, useRouter } from "expo-router";
import {Platform, Text as RNText} from "react-native";
import { useState } from "react";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { createBoard } from "@projectile/shared";
import { useAuth } from "@/components/auth/auth-provider";

const CHEVRON = Icon.select({
  ios: 'chevron.right',
  android: require('@expo/material-symbols/chevron_right.xml'),
});

const PLUS = Icon.select({
  ios: 'plus',
  android: require('@expo/material-symbols/add.xml'),
});

export default function Boards() {
  const { activeProjectState, reloadProject } = useProjectContext()
  const [isCreateBoardSheetPresented, setIsCreateBoardSheetPresented] = useState(false)
  const name = useNativeState("")
  const description = useNativeState("")
  const router = useRouter()
  const auth = useAuth()
  return (
    <>
      <Stack.Screen options={{title: "Boards"}} />
      {/* <ToolbarProjectSwitcher /> */}
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon={PLUS} onPress={() => setIsCreateBoardSheetPresented(true)}>
          Create Board
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
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
        <BottomSheet isPresented={isCreateBoardSheetPresented} onDismiss={() => setIsCreateBoardSheetPresented(false)}>
          <Column style={{padding: 20}} modifiers={[fillMaxWidth()]}>
            <Text textStyle={{fontSize: 30, fontWeight: 'bold'}}>Create Board</Text>
            <Text style={{paddingTop: 5}}>Enter a name and description for your new board</Text>
            <Row style={{paddingTop: 20}}>
              <TextInput textStyle={{fontSize: 18}} placeholder="Board name" value={name} />
            </Row>
            <Row style={{paddingVertical: 20}}>
              <TextInput textStyle={{fontSize: 18}} placeholder="Board description" value={description} />
            </Row>
            <Button modifiers={[fillMaxWidth()]} onPress={async () => {
              setIsCreateBoardSheetPresented(false)
              await createBoard({
                name: name.value,
                description: name.value,
                projectId: activeProjectState?.data?.id || '',
              }, {sessionId: auth.sessionId})
              reloadProject()
            }}>
              <Icon name={PLUS} size={Platform.OS === 'android' ? 24 : 18} />
              <Text>Create Board</Text>
            </Button>
          </Column>
        </BottomSheet>
      </Host>
    </>
  );
}
