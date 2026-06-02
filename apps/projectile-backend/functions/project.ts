import type { version_with_sha } from "bun";
import { PrismaClient, ProjectPermissionLevel, StateType } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL!),
})


export async function createProject({
  name,
  description,
  userId,
}: {
  name: string;
  description: string;
  userId: string;
}) {
  const project = await prisma.project.create({
    data: {
      name,
      description,
      projectPermissions: {
        create: {
          userId,
          permissionLevel: ProjectPermissionLevel.Admin,
        },
      },
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
