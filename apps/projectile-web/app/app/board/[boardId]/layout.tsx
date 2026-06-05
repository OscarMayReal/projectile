"use client"
import { useProjectContext } from "@/components/app/project-switcher";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBoardById, UseBoardState } from "@projectile/shared";
import { ChartLineIcon, CheckIcon, KanbanIcon, ListIcon, SettingsIcon } from "lucide-react";
import { Usable, use, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ProjectLayout({ children, params }: { children: React.ReactNode; params: Usable<{ boardId: string }> }) {
    const pathname = usePathname();
    useEffect(() => {
        console.log(pathname.split("/"));
    }, [pathname]);
    const router = useRouter();
    const { boardId } = use(params);
    const { activeProject } = useProjectContext()
    const {board} = useBoardById(activeProject, boardId);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    if (board.error) {
        return <div>Board not found</div>;
    }
    return <Tabs defaultValue="tasks" value={pathname.split("/")[4] || "tasks"}>
        <div className="w-full h-full flex flex-col">
            <div className="h-[50px] border-b-1 flex-shrink-0 flex flex-row items-center">
                {/* {board.loaded && <div className="ml-5">
                    {board.data?.name}
                </div>} */}
                {board.loaded && <Button variant={"ghost"} className="mx-2" onClick={() => {
                    setIsInfoOpen(true)
                }}>
                    <KanbanIcon />
                    {board.data?.name}    
                </Button>}
                <div className="h-[20px] w-[2px] bg-border" />
                <TabsList variant={"line"} className="h-full ml-2" style={{ height: "100%" }}>
                    <TabsTrigger className="h-full" value="tasks" onClick={() => router.push(`/app/board/${boardId}`)}><CheckIcon />Tasks</TabsTrigger>
                    <TabsTrigger className="h-full" value="feed" onClick={() => router.push(`/app/board/${boardId}/feed`)}><ListIcon />Feed</TabsTrigger>
                    <TabsTrigger className="h-full" value="analytics" onClick={() => router.push(`/app/board/${boardId}/analytics`)}><ChartLineIcon />Analytics</TabsTrigger>
                    <TabsTrigger className="h-full" value="settings" onClick={() => router.push(`/app/board/${boardId}/settings`)}><SettingsIcon />Settings</TabsTrigger>
                </TabsList>
            </div>
            {children}
        </div>
        <BoardDialog isOpen={isInfoOpen} setIsOpen={setIsInfoOpen} board={board} />
    </Tabs>
}

function BoardDialog({isOpen, setIsOpen, board}: {isOpen: boolean, setIsOpen: (isOpen: boolean) => void, board: UseBoardState}) {
    return <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex flex-row items-center gap-2">
                    <KanbanIcon size={16} />
                    {board?.data?.name}
                </DialogTitle>
                <DialogDescription>
                    Info about this board
                </DialogDescription>
            </DialogHeader>
            <div>
                <p><strong>Board ID:</strong> {board?.data?.id}</p>
                <p><strong>Project ID:</strong> {board?.data?.projectId}</p>
                <p><strong>Created:</strong> {board?.data?.createdAt ? new Date(board?.data?.createdAt).toLocaleString() : "Unknown"}</p>
            </div>
            <DialogFooter>
                <Button onClick={() => setIsOpen(false)}><CheckIcon />Done</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>;
}