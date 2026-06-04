"use client"
import { Command, ListIcon, PlusIcon, SearchIcon, SettingsIcon } from "lucide-react"
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
                    <SidebarGroup className="pt-0">
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
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
                </SidebarContent>
                <SidebarFooter>
                    <UserItem />
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
            <SidebarInset className="flex-1">
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