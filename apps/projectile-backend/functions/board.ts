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