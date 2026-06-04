import express from "express";
import { AccountConnectionType, PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getVerifiedSessionFromRequest } from "../functions/session";
import { createProject, getProjectsByUserId } from "../functions/project";

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

export default router;
