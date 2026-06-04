import express from "express";
import { AccountConnectionType, PrismaClient, ProjectPermissionLevel, StateType } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getSessionIdFromRequest, getVerifiedSessionFromRequest } from "../functions/session";

const prisma = new PrismaClient({
    adapter: new PrismaPg(process.env.DATABASE_URL!),
})

const router = express.Router();

router.get("/session", async (req, res) => {
  const sessionId = getSessionIdFromRequest(req);

  console.log("[backend:user] GET /session", {
    sessionId,
    query: req.query,
  });

  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  let ud;
  try {
    ud = (await getVerifiedSessionFromRequest(req)).session;
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }

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

router.post("/session", async (req, res) => {
  const sessionId = getSessionIdFromRequest(req);

  console.log("[backend:user] POST /session", {
    sessionId,
    query: req.query,
    body: req.body,
  });

  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  let ud;
  try {
    ud = (await getVerifiedSessionFromRequest(req)).session;
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }

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
