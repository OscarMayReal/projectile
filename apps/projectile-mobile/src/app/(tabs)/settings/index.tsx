import { Button, Column, FieldGroup, Host, Icon, Row, Switch, Text } from "@expo/ui";
import { Stack } from "expo-router";
import { useState } from "react";
import { Image as ExpoImage } from "expo-image";
import { useAuth } from "@/components/auth/auth-provider";
import { Platform } from "react-native";
import { ToolbarProjectSwitcher } from "@/components/toolbar-project-switcher";

const userIcon = Icon.select({
  ios: "person",
  android: import('@expo/material-symbols/person.xml'),
});

const signOutIcon = Icon.select({
  ios: "rectangle.portrait.and.arrow.right",
  android: import('@expo/material-symbols/logout.xml'),
});

export default function Settings() {
  const [enabled, setEnabled] = useState(false);
  const auth = useAuth();
  return (
    <>
      <Stack.Screen options={{ title: "Settings" }} />
      <ToolbarProjectSwitcher />
      <Host style={{ flex: 1 }}>
        <FieldGroup>
          <FieldGroup.Section>
            {/* <FieldGroup.SectionHeader>
              <Text textStyle={{ fontSize: 16, fontWeight: '700' }}>Account</Text>
            </FieldGroup.SectionHeader> */}

            <Row alignment="center" spacing={10} style={Platform.OS === 'android' ? { paddingVertical: 5 } : {}}>
              <Icon name={userIcon} size={24} />
              <Column spacing={2}>
                <Text textStyle={{ fontSize: 18 }}>{auth.user.user.name}</Text>
                <Text textStyle={{ fontSize: 14, color: '#8E8E93' }}>{auth.user.user.email}</Text>
              </Column>
            </Row>
            {/* <FieldGroup.SectionFooter>
              <Text textStyle={{ fontSize: 12, color: '#8E8E93' }}>
                Helps us improve the app. You can disable this at any time.
              </Text>
            </FieldGroup.SectionFooter> */}
          </FieldGroup.Section>
          <FieldGroup.Section>
            {/* <Row alignment="center" spacing={10} style={Platform.OS === 'android' ? { paddingVertical: 5 } : {}}>
              <Icon name={signOutIcon} size={Platform.OS === 'android' ? 24 : 18} />
              <Text textStyle={{ fontSize: 18 }}>Sign Out</Text>
            </Row> */}
            <Button onPress={() => {
              console.log('Signing out...');
              auth.signOut();
            }} variant={"text"}>
              <Icon name={signOutIcon} size={Platform.OS === 'android' ? 24 : 18} />
              <Text>Sign Out</Text>
            </Button>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </>
  );
}
