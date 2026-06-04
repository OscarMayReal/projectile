import type { Request } from "express";
import { VerifySession } from "keystone-lib";

type SessionRequest = Pick<
  Request,
  "body" | "cookies" | "headers" | "params" | "query"
>;

function toSessionId(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function fromAuthorizationHeader(value: unknown): string | undefined {
  const header = toSessionId(value);
  if (!header) {
    return undefined;
  }

  if (header.toLowerCase().startsWith("bearer ")) {
    return toSessionId(header.slice(7));
  }

  return header;
}

export function getSessionIdFromRequest(req: SessionRequest): string | undefined {
  return (
    toSessionId(req.body?.sessionId) ??
    toSessionId(req.body?.session_id) ??
    toSessionId(req.body?.sessionToken) ??
    toSessionId(req.body?.session_token) ??
    toSessionId(req.query.sessionId) ??
    toSessionId(req.query.session_id) ??
    toSessionId(req.query.sessionToken) ??
    toSessionId(req.query.session_token) ??
    toSessionId(req.params.sessionId) ??
    toSessionId(req.params.session_id) ??
    toSessionId(req.cookies?.sessionId) ??
    toSessionId(req.cookies?.session_id) ??
    toSessionId(req.cookies?.sessionToken) ??
    toSessionId(req.cookies?.session_token) ??
    toSessionId(req.headers["x-session-id"]) ??
    toSessionId(req.headers["x-session-token"]) ??
    fromAuthorizationHeader(req.headers.authorization)
  );
}

type VerifiedSession = Awaited<ReturnType<typeof VerifySession>>;

export async function verifySessionFromRequest(req: SessionRequest): Promise<VerifiedSession> {
  const sessionId = getSessionIdFromRequest(req);

  if (!sessionId) {
    throw new Error("Missing sessionId");
  }

  return VerifySession({
    keystoneUrl: process.env.KEYSTONE_URL!,
    appId: process.env.APP_ID!,
    appSecret: process.env.APP_SECRET!,
    sessionId,
  });
}

export async function getVerifiedSessionFromRequest(req: SessionRequest): Promise<{
  sessionId: string;
  session: VerifiedSession;
}> {
  const sessionId = getSessionIdFromRequest(req);

  if (!sessionId) {
    throw new Error("Missing sessionId");
  }

  const session = await VerifySession({
    keystoneUrl: process.env.KEYSTONE_URL!,
    appId: process.env.APP_ID!,
    appSecret: process.env.APP_SECRET!,
    sessionId,
  });

  return { sessionId, session };
}
