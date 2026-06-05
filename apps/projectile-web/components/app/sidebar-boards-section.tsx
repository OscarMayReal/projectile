import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton } from "@/components/ui/sidebar"
import { KanbanIcon, PlusIcon, XIcon } from "lucide-react"
import { useProjectContext } from "./project-switcher"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldTitle } from "../ui/field"
import { useRef, useState } from "react"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { createBoard, createProject } from "@projectile/shared"
import { useSidebar } from "../ui/sidebar"

export function SidebarBoardsSection() {
    const [createBoardOpen, setCreateBoardOpen] = useState(false)
    const { activeProjectState } = useProjectContext()
    const { state } = useSidebar()
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Boards</SidebarGroupLabel>
            {state === "expanded" && <SidebarGroupAction onClick={() => setCreateBoardOpen(true)}>
                <PlusIcon style={{ width: 14, height: 14 }} />
            </SidebarGroupAction>}
            <SidebarGroupContent>
                {activeProjectState?.data?.boards?.map((board) => (
                    <SidebarMenuButton tooltip={board.name} key={board.id}>
                        <KanbanIcon />
                        {board.name}
                    </SidebarMenuButton>
                ))}
            </SidebarGroupContent>
            <CreateBoardDialog open={createBoardOpen} onOpenChange={setCreateBoardOpen} />
        </SidebarGroup>
    )
}

export function CreateBoardDialog({open, onOpenChange}: {open: boolean, onOpenChange: (open: boolean) => void}) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const { activeProjectState, reloadProject } = useProjectContext()
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Board</DialogTitle>
                    <DialogDescription>A board is used to organize and track tasks.</DialogDescription>
                </DialogHeader>
                <Separator />
                <Field>
                    <FieldTitle>Board Name</FieldTitle>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field>
                    <FieldTitle>Board Description</FieldTitle>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                </Field>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}><XIcon />Cancel</Button>
                    <Button onClick={async () => {
                        await createBoard({ name, projectId: activeProjectState?.data?.id || "", description })
                        onOpenChange(false)
                        reloadProject()
                    }}><PlusIcon />Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}