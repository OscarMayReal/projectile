import express from "express";
import { VerifySession } from "keystone-lib";

const router = express.Router();

router.get("/session", async (req, res) => {
  const ud = await VerifySession({
    keystoneUrl: process.env.KEYSTONE_URL!,
    appId: process.env.APP_ID!,
    appSecret: process.env.APP_SECRET!,
    sessionId: req.cookies.sessionId,
  });
  res.json(ud);
});

export default router;