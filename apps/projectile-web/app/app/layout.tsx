import { ListIcon, SearchIcon, SettingsIcon } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInset, SidebarMenuButton, SidebarProvider, SidebarRail } from "@/components/ui/sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className="bg-white">
      <Sidebar collapsible="icon" variant={"floating"}>
        <SidebarContent>
            <SidebarGroup>
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
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="flex-1">
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
