import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { createContext, useContext, useEffect, useState } from "react";
import { Linking as NativeLinking } from "react-native";

import {
  buildKeystoneAuthUrl,
  clearStoredSessionId,
  extractSessionId,
  getAuthRedirectUrl,
  getStoredSessionId,
  storeSessionId,
  verifySession,
} from "@/lib/auth";

WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  user: any;
  sessionId: string | null;
  ready: boolean;
  signingIn: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  completeSession: (sessionId: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeSessionId(input: string | null | undefined) {
  if (!input) {
    return null;
  }

  const trimmed = input.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeSession = async (nextSessionId: string) => {
    console.log("[auth] completeSession start", nextSessionId);
    const normalized = normalizeSessionId(nextSessionId);
    if (!normalized) {
      console.warn("[auth] completeSession missing session id");
      throw new Error("Missing session id");
    }

    setError(null);

    try {
      const data = await verifySession(normalized);
      await storeSessionId(normalized);
      setSessionId(normalized);
      setUser(data);
      console.log("[auth] completeSession success", normalized);
    } catch (error) {
      await clearStoredSessionId();
      setSessionId(null);
      setUser(null);
      setError(error instanceof Error ? error.message : "Failed to verify session");
      console.error("[auth] completeSession failed", error);
      throw error;
    }
  };

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        console.log("[auth] initial url", initialUrl);
        const sessionFromUrl = normalizeSessionId(extractSessionId(initialUrl ?? ""));
        console.log("[auth] session from initial url", sessionFromUrl);

        if (sessionFromUrl) {
          await completeSession(sessionFromUrl);
          return;
        }

        const storedSessionId = normalizeSessionId(await getStoredSessionId());
        console.log("[auth] stored session", { storedSessionId });

        if (storedSessionId) {
          await completeSession(storedSessionId);
        }
      } catch (error) {
        await clearStoredSessionId();
        setSessionId(null);
        setUser(null);
        setError(error instanceof Error ? error.message : "Failed to initialize auth");
      } finally {
        if (active) {
          setReady(true);
        }
      }
    };

    const handleUrl = async (url: string) => {
      console.log("[auth] url event", url);
      const nextSessionId = normalizeSessionId(extractSessionId(url));
      console.log("[auth] session from event url", nextSessionId);
      if (!nextSessionId) {
        return;
      }

      try {
        await completeSession(nextSessionId);
      } catch {
        await clearStoredSessionId();
        setSessionId(null);
        setUser(null);
        setError("Received a session, but verification failed.");
      } finally {
        setReady(true);
      }
    };

    bootstrap();

    const subscription = NativeLinking.addEventListener("url", (event) => {
      void handleUrl(event.url);
    });

    return () => {
      active = false;
      subscription?.remove?.();
    };
  }, []);

  const signIn = async () => {
    setSigningIn(true);
    try {
      const redirectUrl = getAuthRedirectUrl();
      const authUrl = buildKeystoneAuthUrl(redirectUrl);
      console.log("[auth] opening auth session", { authUrl, redirectUrl });

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      console.log("[auth] auth session result", result);
      if (result.type === "success") {
        const nextSessionId = normalizeSessionId(extractSessionId(result.url));
        console.log("[auth] session from auth result", nextSessionId);

        if (nextSessionId) {
          await completeSession(nextSessionId);
        }
      } else {
        console.warn("[auth] auth session non-success", result.type);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign in failed");
      console.error("[auth] signIn failed", error);
      throw error;
    } finally {
      setSigningIn(false);
      setReady(true);
    }
  };

  const signOut = () => {
    console.log("[auth] signOut");
    void clearStoredSessionId();
    setSessionId(null);
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    console.log("[auth] clearError");
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionId,
        ready,
        signingIn,
        error,
        signIn,
        completeSession,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
