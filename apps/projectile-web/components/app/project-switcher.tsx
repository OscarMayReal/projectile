"use client"

import * as React from "react"
import { ChevronDown, Command, Plus, UsersIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useProjects } from "@projectile/shared"
import { createContext, useContext, useEffect } from "react"
import { Project, useProjectById, UseProjectsState, UseProjectState } from "../../../../packages/projectile-shared/src/projects/hooks"

export function ProjectSwitcher({visible = true}) {
  const router = useRouter()
  const sidebar = useSidebar()

  const {activeProject, setActiveProject, projects} = React.useContext(projectContext)

  
  useEffect(() => {
    setActiveProject(window?.localStorage?.getItem('activeProjectId') ? window.localStorage.getItem('activeProjectId') : undefined)
  }, [])
  useEffect(() => {
    window.localStorage.setItem('activeProjectId', activeProject)
  }, [activeProject])

  useEffect(() => {
    if (projects.loaded && projects.data.length == 0) {
      router.push('/createProject')
    }
    if ((!activeProject || activeProject === 'undefined') && projects.data && projects.data.length > 0) {
      setActiveProject(projects.data[0].id)
    }
  }, [projects, activeProject])

  if (!activeProject || !projects.loaded) {
    return <div className="h-[32px]" />
  }

  return (
    <SidebarMenu className={visible ? "" : "hidden"}>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
                <UsersIcon className="size-3" />
              </div>
              <span className="truncate font-medium">{projects.data?.find((project) => project.id === activeProject)?.name}</span>
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projects
            </DropdownMenuLabel>
            {projects.data?.map((project, index) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => setActiveProject(project.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <UsersIcon className="size-4 shrink-0" />
                </div>
                {project.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={() => {
              router.push("/createProject");
            }}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add project</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export const projectContext = createContext<{ projects: UseProjectsState, activeProject: string, setActiveProject: (project: string) => void, activeProjectState: UseProjectState | null, reloadProject: () => void }>({ projects: { loaded: false, loading: false, data: [], error: null }, activeProject: "", setActiveProject: () => {}, activeProjectState: null, reloadProject: () => {} })

export const ProjectContextProvider = ({ children }: { children: React.ReactNode }) => {
  const {projects} = useProjects({})
  const [activeProject, setActiveProject] = React.useState<any>(undefined)
  const {project, reload: reloadProject} = useProjectById(activeProject)
  return (
    <projectContext.Provider value={{ projects: projects, activeProject: activeProject, setActiveProject: setActiveProject, activeProjectState: project, reloadProject }}>
      {children}
    </projectContext.Provider>
  )
}

export function useProjectContext() {
  return useContext(projectContext)
}