"use client"
import { BugIcon, ClockIcon, Command, KanbanIcon, ListIcon, PlusIcon, SearchIcon, SettingsIcon, SparklesIcon } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenuButton, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar"
import { AuthManager } from "@/components/auth/authManager"
import { UserItem } from "@/components/auth/userItem"
import { ProjectContextProvider, ProjectSwitcher } from "@/components/app/project-switcher"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { useProjects } from "@projectile/shared"
import { SidebarBoardsSection } from "@/components/app/sidebar-boards-section"
import { SidebarItem } from "@/components/app/sidebar-item"
import { useRouter } from "next/navigation"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const router = useRouter()
  return (
    <AuthManager>
        <ProjectContextProvider>
            <SidebarProvider
                className="bg-white"
            >
                <Sidebar 
                    collapsible="icon" 
                    variant={"inset"}
                >
                    <SidebarHeaderSection />
                    <SidebarContent>
                        <SidebarGroup>
                            {/* <SidebarGroupLabel>Menu</SidebarGroupLabel> */}
                            <SidebarGroupContent>
                                <SidebarItem Icon={ListIcon} label="Feed" location={{mode: "equals", path: "/app"}} onClick={() => router.push("/app")} />
                                <SidebarItem Icon={SearchIcon} label="Search" location={{mode: "includes", path: "/app/search"}} onClick={() => router.push("/app/search")} />
                                <SidebarItem Icon={SettingsIcon} label="Settings" location={{mode: "includes", path: "/app/settings"}} onClick={() => router.push("/app/settings")} />
                            </SidebarGroupContent>
                        </SidebarGroup>
                       <SidebarBoardsSection />
                        <SidebarGroup>
                            <SidebarGroupLabel>Feedback & updates</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenuButton tooltip="Bug reports">
                                    <BugIcon />
                                    Bug reports
                                </SidebarMenuButton>
                                <SidebarMenuButton tooltip="Feature requests">
                                    <SparklesIcon />
                                    Feature requests
                                </SidebarMenuButton>
                                <SidebarMenuButton tooltip="Changelog">
                                    <ClockIcon />
                                    Changelog
                                </SidebarMenuButton>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <UserItem />
                    </SidebarFooter>
                    {/* <SidebarRail /> */}
                </Sidebar>
                <SidebarInset className="flex-1" style={{ marginLeft: 0, borderRadius: "8px" }}>
                    <main className="flex-1">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ProjectContextProvider>
    </AuthManager>
  )
}

function SidebarHeaderSection() {
    const sb = useSidebar()
    return (
        <SidebarHeader>
            <div className="flex flex-row w-full">
                <ProjectSwitcher visible={sb.state === "expanded"} />
                {sb.state === "expanded" && <div className="flex-1" />}
                <SidebarTrigger size={"icon"} />
            </div>
            <Button variant={"outline"}><PlusIcon />{sb.state === "expanded" ? "Create" : ""}</Button>
        </SidebarHeader>
    )
}