import { useAuth } from "@/components/auth/auth-provider";
import { ToolbarProjectSwitcher, useProjectContext } from "@/components/toolbar-project-switcher";
import { Host, Text } from "@expo/ui";
import { useBoardById, useProjectById } from "@projectile/shared";
import { Stack, useLocalSearchParams } from "expo-router";


export default function Board() {
    const auth = useAuth()
    const params = useLocalSearchParams<{board: string}>();
    const {activeProject} = useProjectContext()
    const project = useBoardById(activeProject, params.board, {
        sessionId: auth.sessionId
    })
  return (
    <>
      <Stack.Screen options={{title: project.board.loaded ? project.board.data?.name : "Loading...", headerBackButtonDisplayMode: "minimal"}} />
      <Host>
        <Text>board</Text>
      </Host>
    </>
  );
}
