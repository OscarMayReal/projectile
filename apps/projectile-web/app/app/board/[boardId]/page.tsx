"use client"
import { useProjectContext } from "@/components/app/project-switcher";
import { Kanban, KanbanBoard, KanbanColumn, KanbanItem } from "@/components/ui/kanban";
import { Task, useBoardById } from "@projectile/shared";
import { Usable, use } from "react";
import { useEffect, useState } from "react";

export default function AppPage({ params }: { params: Usable<{ boardId: string }> }) {
  const { boardId } = use(params);
    const { activeProject } = useProjectContext();
  const { board } = useBoardById(activeProject, boardId);
  const [columns, setColumns] = useState<Record<string, Task[]>>({})
  useEffect(() => {
    var newColumns: Record<string, Task[]> = {}
    board.data?.states?.forEach((state) => {
      newColumns[state.id] = state.tasks || []
    })
    setColumns(newColumns)
  }, [board])
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-6 pb-0">
        <h1 className="text-2xl font-bold">{board.data?.name}: Tasks ({Object.values(columns).reduce((acc, tasks) => acc + tasks.length, 0)})</h1>
      </div>
      <Kanban value={columns} getItemValue={(task) => task.id}>
        <KanbanBoard className="p-6">
          {Object.entries(columns).map(([columnId, tasks]) => (
            <KanbanColumn key={columnId} value={columnId}>
              <div className="flex flex-row items-center mx-2">
                <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: board.data?.states?.find((state) => state.id === columnId)?.color || "gray"}} />
                <div className="font-semibold">{board.data?.states?.find((state) => state.id === columnId)?.name}</div>
              </div>
              {tasks.map((task) => (
                <KanbanItem key={task.id} value={task.id}>
                  {task.name}
                </KanbanItem>
              ))}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </Kanban>
    </div>
  );
}
