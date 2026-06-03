import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

export const SIGN_IN_PATH = "signin" as const;
export const AUTH_CALLBACK_PATH = "auth/callback" as const;
export const SIGN_IN_ROUTE = "/signin" as const;
export const AUTH_CALLBACK_ROUTE = "/auth/callback" as const;
export const HOME_ROUTE = "/feed" as const;

const DEFAULT_API_URL = "http://localhost:3001";
const SESSION_STORAGE_KEY = "projectile.sessionId";

export function getKeystoneUrl() {
  return process.env.EXPO_PUBLIC_KEYSTONE_URL ?? process.env.KEYSTONE_URL ?? "";
}

export function getAppId() {
  return process.env.EXPO_PUBLIC_APP_ID ?? process.env.APP_ID ?? "";
}

export function getApiUrl() {
  return process.env.EXPO_PUBLIC_API_URL ?? process.env.API_URL ?? DEFAULT_API_URL;
}

export function getAuthRedirectUrl() {
  const redirectUrl = Linking.createURL(AUTH_CALLBACK_PATH, { isTripleSlashed: true });
  console.log("[auth] redirect url", redirectUrl);
  return redirectUrl;
}

export function buildKeystoneAuthUrl(redirectUrl: string) {
  const keystoneUrl = getKeystoneUrl();
  const appId = getAppId();

  if (!keystoneUrl) {
    throw new Error("Missing EXPO_PUBLIC_KEYSTONE_URL");
  }

  if (!appId) {
    throw new Error("Missing EXPO_PUBLIC_APP_ID");
  }

  const url = new URL("/auth/redirect", keystoneUrl);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUrl", redirectUrl);
  console.log("[auth] keystone auth url", url.toString());

  return url.toString();
}

export function extractSessionId(url: string) {
  try {
    return new URL(url).searchParams.get("sessionId");
  } catch {
    return null;
  }
}

export async function getStoredSessionId() {
  return SecureStore.getItemAsync(SESSION_STORAGE_KEY);
}

export async function storeSessionId(sessionId: string) {
  await SecureStore.setItemAsync(SESSION_STORAGE_KEY, sessionId);
}

export async function clearStoredSessionId() {
  await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY);
}

export async function verifySession(sessionId: string) {
  const url = new URL(`${getApiUrl()}/user/session`);
  url.searchParams.set("sessionId", sessionId);
  console.log("[auth] verify session request", {
    apiUrl: getApiUrl(),
    sessionId,
    url: url.toString(),
  });
  const response = await fetch(url.toString());

  if (!response.ok) {
    console.warn("[auth] verify session failed", response.status);
    throw new Error(`Failed to verify session: ${response.status}`);
  }

  const data = await response.json();
  console.log("[auth] verify session success", data);
  return data;
}
