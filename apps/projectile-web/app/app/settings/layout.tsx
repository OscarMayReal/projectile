"use client"
import { SidebarItem } from "@/components/app/sidebar-item";
import { SidebarContent } from "@/components/ui/sidebar";
import { HistoryIcon, MessageSquareQuoteIcon, SettingsIcon, UsersIcon } from "lucide-react";

export default function AppPage({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-row h-full w-full">
    <SidebarContent className="border-r-1 max-w-[275px] p-4">
      <h1 className="text-2xl font-semibold p-2">Settings</h1>
      <SidebarItem Icon={SettingsIcon} label="General" location={{mode: "equals", path: "/app/settings"}} />
      <SidebarItem Icon={UsersIcon} label="Members" location={{mode: "includes", path: "/app/settings/members"}} />
      <SidebarItem Icon={MessageSquareQuoteIcon} label="Feedback" location={{mode: "includes", path: "/app/settings/feedback"}} />
      <SidebarItem Icon={HistoryIcon} label="Changelog" location={{mode: "includes", path: "/app/settings/changelog"}} />
    </SidebarContent>
    {children}
  </div>
}
