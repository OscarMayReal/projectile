import { PrismaClient, ProjectPermissionLevel } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL!),
})


export async function createProject({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) {
  const project = await prisma.project.create({
    data: {
      name,
      permissions: {
        create: {
          userId,
          permissionLevel: ProjectPermissionLevel.Admin,
        },
      },
    },
  });
  return project;
}

export async function getProjectsByUserId(userId: string) {
  const projects = await prisma.project.findMany({
    where: {
      permissions: {
        some: {
          userId,
        },
      },
    },
  });
  return projects;
}

export async function getProjectById(projectId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
  return project;
}