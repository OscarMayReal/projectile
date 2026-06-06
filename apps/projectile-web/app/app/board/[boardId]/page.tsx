"use client"
import { useProjectContext } from "@/components/app/project-switcher"
import { Button } from "@/components/ui/button"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanItem,
  KanbanOverlay,
} from "@/components/ui/kanban"
import {
  createTask,
  State,
  Task,
  updateTask,
  useBoardById,
} from "@projectile/shared"
import { PlusCircleIcon, SaveIcon } from "lucide-react"
import { Usable, use, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default function AppPage({
  params,
}: {
  params: Usable<{ boardId: string }>
}) {
  const { boardId } = use(params)
  const { activeProject } = useProjectContext()
  const { board, reload } = useBoardById(activeProject, boardId)

  const initialColumns = useMemo(() => {
    const columns: Record<string, Task[]> = {}
    board.data?.states?.forEach((state) => {
      columns[state.id] = state.tasks || []
    })
    return columns
  }, [board.data?.states])

  const boardColumnsKey = useMemo(
    () =>
      board.data?.states
        ?.map(
          (state) =>
            `${state.id}:${state.tasks
              .map((task) => `${task.id}:${task.stateId}:${task.updatedAt}`)
              .join(",")}`
        )
        .join("|") ?? "loading",
    [board.data?.states]
  )

  return (
    <BoardTaskKanban
      key={boardColumnsKey}
      boardName={board.data?.name}
      states={board.data?.states ?? []}
      initialColumns={initialColumns}
      projectId={activeProject}
      boardId={boardId}
      reloadBoard={reload}
    />
  )
}

function BoardTaskKanban({
  boardName,
  states,
  initialColumns,
  projectId,
  boardId,
  reloadBoard,
}: {
  boardName?: string
  states: State[]
  initialColumns: Record<string, Task[]>
  projectId: string
  boardId: string
  reloadBoard: () => void
}) {
  const [columns, setColumns] = useState<Record<string, Task[]>>(initialColumns)

  return (
    <div className="flex h-full w-full flex-col">
      <div className="p-6 pb-0">
        <h1 className="text-2xl font-bold">
          {boardName}: Tasks (
          {Object.values(columns).reduce((acc, tasks) => acc + tasks.length, 0)}
          )
        </h1>
      </div>
      <Kanban
        value={columns}
        onValueChange={(value) => {
          const currentTaskColumns = new Map<string, string>()
          Object.entries(columns).forEach(([columnId, tasks]) => {
            tasks.forEach((task) => currentTaskColumns.set(task.id, columnId))
          })

          const movedTask = Object.entries(value)
            .flatMap(([columnId, tasks]) =>
              tasks.map((task) => ({ task, columnId }))
            )
            .find(
              ({ task, columnId }) =>
                currentTaskColumns.get(task.id) !== columnId
            )

          const nextColumns = movedTask
            ? (Object.fromEntries(
                Object.entries(value).map(([columnId, tasks]) => [
                  columnId,
                  tasks.map((task) =>
                    task.id === movedTask.task.id
                      ? { ...task, stateId: movedTask.columnId }
                      : task
                  ),
                ])
              ) as Record<string, Task[]>)
            : value

          if (movedTask) {
            void updateTask({
              taskId: movedTask.task.id,
              stateId: movedTask.columnId,
              name: movedTask.task.name,
              description: movedTask.task.description || "",
              projectId,
              boardId: boardId,
            }).catch((error) => {
              console.error("Failed to update task", error)
              reloadBoard()
            })
          }

          setColumns(nextColumns)
        }}
        getItemValue={(task) => task.id}
      >
        <KanbanBoard className="p-6">
          {Object.entries(columns).map(([columnId, tasks]) => (
            <KanbanColumn key={columnId} value={columnId}>
              <div className="mx-2 flex flex-row items-center">
                <div
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      states.find((state) => state.id === columnId)?.color ||
                      "gray",
                  }}
                />
                <div className="font-semibold">
                  {states.find((state) => state.id === columnId)?.name}
                </div>
                <div className="flex-1" />
                <CreateTaskDialog
                  projectId={projectId}
                  boardId={boardId}
                  stateId={columnId}
                  reloadBoard={reloadBoard}
                />
              </div>
              {tasks.map((task) => (
                <KanbanItem key={task.id} value={task.id} asHandle asChild>
                  <div className="rounded-md border bg-card p-3 shadow-xs">
                    <h1 className="text-lg font-semibold">{task.name}</h1>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                </KanbanItem>
              ))}
            </KanbanColumn>
          ))}
        </KanbanBoard>
        <KanbanOverlay>
          <div className="size-full rounded-md bg-primary/10" />
        </KanbanOverlay>
      </Kanban>
    </div>
  )
}

function CreateTaskDialog({
  projectId,
  boardId,
  stateId,
  reloadBoard,
}: {
  projectId: string
  boardId: string
  stateId: string
  reloadBoard: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button size="icon-sm" variant={"ghost"}>
          <PlusCircleIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{
          maxWidth: 600,
          width: 600,
        }}
      >
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <Separator />
        <Input
          placeholder="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            height: 200,
          }}
        />
        <DialogFooter>
          <Button
            onClick={async () => {
              await createTask({
                projectId: projectId,
                boardId: boardId,
                stateId: stateId,
                name: name,
                description: description,
              })
              setIsOpen(false)
              reloadBoard()
            }}
          >
            <SaveIcon />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
