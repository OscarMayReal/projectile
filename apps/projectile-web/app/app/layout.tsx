"use client"
import { BugIcon, ClockIcon, Command, KanbanIcon, ListIcon, PlusIcon, SearchIcon, SettingsIcon, SparklesIcon } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenuButton, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar"
import { AuthManager } from "@/components/auth/authManager"
import { UserItem } from "@/components/auth/userItem"
import { ProjectSwitcher } from "@/components/app/project-switcher"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthManager>
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
                            <SidebarMenuButton className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
                                <ListIcon />
                                Feed
                            </SidebarMenuButton>
                            <SidebarMenuButton>
                                <SearchIcon />
                                Search
                            </SidebarMenuButton>
                            <SidebarMenuButton>
                                <SettingsIcon />
                                Settings
                            </SidebarMenuButton>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Boards</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenuButton>
                                <KanbanIcon />
                                Board 1
                            </SidebarMenuButton>
                            <SidebarMenuButton>
                                <KanbanIcon />
                                Board 2
                            </SidebarMenuButton>
                            <SidebarMenuButton>
                                <KanbanIcon />
                                Board 3
                            </SidebarMenuButton>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Feedback & updates</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenuButton>
                                <BugIcon />
                                Bug reports
                            </SidebarMenuButton>
                            <SidebarMenuButton>
                                <SparklesIcon />
                                Feature requests
                            </SidebarMenuButton>
                            <SidebarMenuButton>
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
    </AuthManager>
  )
}

export function SidebarHeaderSection() {
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