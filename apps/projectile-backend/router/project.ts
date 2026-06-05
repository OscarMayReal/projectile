import express from "express";
import { AccountConnectionType, PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getVerifiedSessionFromRequest } from "../functions/session";
import { createProject, getProjectById, getProjectsByUserId } from "../functions/project";
import { createBoard, getBoardById } from "../functions/board";

const prisma = new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL!),
})

const router = express.Router();

router.post("/create", async (req, res) => {
    const { name } = req.body;
    const { session } = await getVerifiedSessionFromRequest(req);
    const user = await prisma.user.findUnique({
        where: {
            userConnectionId_accountConnectionType: {
                userConnectionId: session.user.id,
                accountConnectionType: AccountConnectionType.KeyStone,
            },
        },
    })
    const project = await createProject({
        name,
        userId: user!.id,
    })
    res.json(project);
});

router.get("/list", async (req, res) => {
    const { session } = await getVerifiedSessionFromRequest(req);
    const user = await prisma.user.findUnique({
        where: {
            userConnectionId_accountConnectionType: {
                userConnectionId: session.user.id,
                accountConnectionType: AccountConnectionType.KeyStone,
            },
        },
    })
    const projects = await getProjectsByUserId(user!.id)
    res.json(projects);
})

router.get("/p/:projectid/get", async (req, res) => {
    const { session } = await getVerifiedSessionFromRequest(req);
    const user = await prisma.user.findUnique({
        where: {
            userConnectionId_accountConnectionType: {
                userConnectionId: session.user.id,
                accountConnectionType: AccountConnectionType.KeyStone,
            },
        },
    })
    const project = await getProjectById(req.params.projectid)
    if (project && project.permissions.some((permission) => permission.userId === user?.id)) {
        res.json(project);
    } else {
        res.status(403).json({ error: "Forbidden" })
    }
})

router.post("/p/:projectid/boards/create", async (req, res) => {
    const { name, description } = req.body;
    const { session } = await getVerifiedSessionFromRequest(req);
    const user = await prisma.user.findUnique({
        where: {
            userConnectionId_accountConnectionType: {
                userConnectionId: session.user.id,
                accountConnectionType: AccountConnectionType.KeyStone,
            },
        },
    })
    const board = await createBoard({
        name,
        description,
        projectId: req.params.projectid,
        createdBy: user!.id,
    })
    res.json(board);
});

router.get("/p/:projectid/b/:boardid/get", async (req, res) => {
    const { session } = await getVerifiedSessionFromRequest(req);
    const user = await prisma.user.findUnique({
        where: {
            userConnectionId_accountConnectionType: {
                userConnectionId: session.user.id,
                accountConnectionType: AccountConnectionType.KeyStone,
            },
        },
    })
    const project = await getProjectById(req.params.projectid)
    if (project && project.permissions.some((permission) => permission.userId === user?.id)) {
        const board = await getBoardById(req.params.boardid)
        res.json(board);
    } else {
        res.status(403).json({ error: "Forbidden" })
    }
});

export default router;
