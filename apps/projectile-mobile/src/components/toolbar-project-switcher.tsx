import { Stack } from "expo-router";
import person_2 from "@expo/material-symbols/person_2.xml"
import React, { createContext, useContext, useEffect } from "react";
import { useProjectById, useProjects } from "@projectile/shared"
import { UseProjectsState, UseProjectState } from "../../../../packages/projectile-shared/src/projects/hooks";
import { useAuth } from "./auth/auth-provider";

export function ToolbarProjectSwitcher() {
    const {projects, activeProject, setActiveProject} = useProjectContext()
    return <Stack.Toolbar placement="left">
        <Stack.Toolbar.Menu title={projects.data.find(project => project.id == activeProject)?.name}>
            {projects.data.map((project) => (
                <Stack.Toolbar.MenuAction key={project.id} onPress={() => setActiveProject(project.id)} icon={process.env.EXPO_OS === 'ios' ? "person.2" : person_2}>
                    {project.name}
                </Stack.Toolbar.MenuAction>
            ))}
        </Stack.Toolbar.Menu>
    </Stack.Toolbar>
}

export const projectContext = createContext<{ projects: UseProjectsState, activeProject: string, setActiveProject: (project: string) => void, activeProjectState: UseProjectState | null, reloadProject: () => void }>({ projects: { loaded: false, loading: false, data: [], error: null }, activeProject: "", setActiveProject: () => {}, activeProjectState: null, reloadProject: () => {} })

export const ProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuth()
    const {projects} = useProjects({sessionId: auth.sessionId})
    const [activeProject, setActiveProject] = React.useState<any>(undefined)
    const {project, reload: reloadProject} = useProjectById(activeProject)
    useEffect(() => {
        if (projects.data.length > 0 && !activeProject) {
            setActiveProject(projects.data[0].id)
        }
    }, [projects.data, activeProject])
    return (
        <projectContext.Provider value={{ projects: projects, activeProject: activeProject, setActiveProject: setActiveProject, activeProjectState: project, reloadProject }}>
            {children}
        </projectContext.Provider>
    )
}

export function useProjectContext() {
  return useContext(projectContext)
}