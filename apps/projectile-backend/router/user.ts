import express from "express";
import { VerifySession } from "keystone-lib";

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
  res.json(ud);
});

export default router;
