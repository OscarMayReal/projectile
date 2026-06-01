import { Stack } from "expo-router";

import { getMaterialColors } from '@expo/ui/jetpack-compose';
import { Platform } from 'react-native';
import { View } from 'react-native';

export default function Layout() {
    const colors = Platform.OS === 'android' ? getMaterialColors() : undefined;
    return (
        <View style={{ backgroundColor: colors?.background, flex: 1 }}>
            <Stack screenOptions={{ headerLargeTitle: true, headerShadowVisible: false, headerStyle: { backgroundColor: colors?.background }, contentStyle: { backgroundColor: colors?.background } }}>
            </Stack>
        </View>
    );
}
