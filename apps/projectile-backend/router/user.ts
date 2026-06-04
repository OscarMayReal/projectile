import express from "express";
import { VerifySession } from "keystone-lib";
import { AccountConnectionType, PrismaClient, ProjectPermissionLevel, StateType } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL!),
})

const router = express.Router();

router.get("/session", async (req, res) => {
  const sessionId =
    req.query.sessionId ||
    req.body?.sessionId ||
    req.cookies.sessionId ||
    req.header("x-session-id");

  console.log("[backend:user] GET /session", {
    sessionId,
    query: req.query,
  });

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  const ud = await VerifySession({
    keystoneUrl: process.env.KEYSTONE_URL!,
    appId: process.env.APP_ID!,
    appSecret: process.env.APP_SECRET!,
    sessionId,
  });
  res.json(ud);
});

router.post("/session", async (req, res) => {
  const sessionId =
    req.body?.sessionId ||
    req.query.sessionId ||
    req.cookies.sessionId ||
    req.header("x-session-id");

  console.log("[backend:user] POST /session", {
    sessionId,
    query: req.query,
    body: req.body,
  });

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  const ud = await VerifySession({
    keystoneUrl: process.env.KEYSTONE_URL!,
    appId: process.env.APP_ID!,
    appSecret: process.env.APP_SECRET!,
    sessionId,
  });

  const user = await prisma.user.upsert({
    where: {
      userConnectionId_accountConnectionType: {
        userConnectionId: ud.user.id,
        accountConnectionType: AccountConnectionType.KeyStone,
      },
    },
    create: {
      email: ud.user.email!,
      name: ud.user.name!,
      userConnectionId: ud.user.id,
      accountConnectionType: AccountConnectionType.KeyStone,
    },
    update: {
      email: ud.user.email!,
      name: ud.user.name!,
    },
  });

  res.json(ud);
});

export default router;
