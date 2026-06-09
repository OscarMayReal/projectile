import { name } from "node:assert";
import { PrismaClient, StateType } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL!),
})


export async function createBoard({
  name,
  description,
  projectId,
  createdBy
}: {
  name: string;
  description: string;
  projectId: string;
  createdBy: string;
}) {
  const project = await prisma.board.create({
    data: {
      projectId,
      name,
      description,
      createdBy,
      states: {
        create: [
            {
                name: "To Do",
                color: "#6b7280",
                type: StateType.Open,
            },
            {
                name: "In Progress",
                color: "#3b82f6",
                type: StateType.InProgress,
            },
            {
                name: "Review",
                color: "#f59e0b",
                type: StateType.Done,
            },
            {
                name: "Done",
                color: "#10b981",
                type: StateType.Closed,
            },
        ]
      },
    },
  });
  return project;
}

export async function getBoardsByProjectId(projectId: string) {
  const boards = await prisma.board.findMany({
    where: {
      projectId,
    },
  });
  return boards;
}

export async function getBoardById(boardId: string) {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
    include: {
      states: {
        include: {
          tasks: {
            include: {
              assignedTasks: {
                include: {
                  user: true,
                },
              },
              comments: {
                include: {
                  user: true,
                },
              },
              creatorUser: true,
            },
          },
        },
      },
      project: {
        include: {
          permissions: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  return board;
}

export async function createTask({
  boardId,
  name,
  description,
  stateId,
  createdBy,
}: {
  boardId: string;
  name: string;
  description: string;
  stateId: string;
  createdBy: string;
}) {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
    include: {
      states: true
    }
  });
  if (!board) {
    throw new Error("Board not found");
  }
  if (!stateId) {
    stateId = board.states.find((state) => state.type === StateType.Open)?.id;
  }
  const task = await prisma.task.create({
      data: {
          name,
          description,
          board: {
            connect: {
              id: boardId,
            },
          },
          state: {
            connect: {
              id: stateId,
            },
          },
          creatorUser: {
            connect: {
              id: createdBy,
            },
          },

      },
  });
  return task;
}

export async function updateTask({
  taskId,
  name,
  description,
  stateId,
}: {
  taskId: string;
  name?: string;
  description?: string;
  stateId?: string;
}) {
    const task = await prisma.task.update({
        where: {
            id: taskId,
        },
        data: {
            name,
            description,
            state: {
                connect: {
                    id: stateId,
                },
            },
        },
    });
    return task;
}

export async function CreateComment({taskId, content, createdBy}: {taskId: string; content: string; createdBy: string}) {
  const comment = await prisma.taskComment.create({
    data: {
      content,
      task: {
        connect: {
          id: taskId,
        },
      },
      user: {
        connect: {
          id: createdBy,
        },
      },
    },
    include: {
      user: true,
    },
  });
  return comment;
    
}