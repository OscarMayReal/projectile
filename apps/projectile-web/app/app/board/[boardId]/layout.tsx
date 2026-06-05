"use client"
import { useProjectContext } from "@/components/app/project-switcher";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBoardById } from "@projectile/shared";
import { ChartLineIcon, CheckIcon, ListIcon, SettingsIcon } from "lucide-react";
import { Usable, use } from "react";

export default function ProjectLayout({ children, params }: { children: React.ReactNode; params: Usable<{ boardId: string }> }) {
    const { boardId } = use(params);
    const { activeProject } = useProjectContext()
    const {board} = useBoardById(activeProject, boardId);
    if (board.error) {
        return <div>Board not found</div>;
    }
    return <Tabs defaultValue="tasks">
        <div className="w-full h-full flex flex-col">
            <div className="h-[50px] border-b-1 flex-shrink-0 flex flex-row items-center">
                {board.loaded && <div className="ml-5">
                    {board.data?.name}
                </div>}
                <TabsList variant={"line"} className="h-full ml-3" style={{ height: "100%" }}>
                    <TabsTrigger className="h-full" value="tasks"><CheckIcon />Tasks</TabsTrigger>
                    <TabsTrigger className="h-full" value="feed"><ListIcon />Feed</TabsTrigger>
                    <TabsTrigger className="h-full" value="analytics"><ChartLineIcon />Analytics</TabsTrigger>
                    <TabsTrigger className="h-full" value="settings"><SettingsIcon />Settings</TabsTrigger>
                </TabsList>
            </div>
            {children}
        </div>
    </Tabs>
}