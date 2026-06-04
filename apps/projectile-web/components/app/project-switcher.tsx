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
import { useEffect } from "react"

export function ProjectSwitcher({visible = true}) {
  const router = useRouter()
  const sidebar = useSidebar()
  const { projects } = useProjects({})
  
  const [activeTeam, setActiveTeam] = React.useState<any>(undefined)
  useEffect(() => {
    setActiveTeam(window?.localStorage?.getItem('activeProjectId') ? window.localStorage.getItem('activeProjectId') : undefined)
  }, [])
  useEffect(() => {
    window.localStorage.setItem('activeProjectId', activeTeam)
  }, [activeTeam])

  useEffect(() => {
    if (projects.loaded && projects.data.length == 0) {
      router.push('/createProject')
    }
    if ((!activeTeam || activeTeam === 'undefined') && projects.data && projects.data.length > 0) {
      setActiveTeam(projects.data[0].id)
    }
  }, [projects, activeTeam])

  if (!activeTeam || !projects.loaded) {
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
              <span className="truncate font-medium">{projects.data?.find((project) => project.id === activeTeam)?.name}</span>
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
                onClick={() => setActiveTeam(project.id)}
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
