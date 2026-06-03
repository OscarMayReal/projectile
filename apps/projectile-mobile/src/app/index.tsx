import { Redirect } from "expo-router";
import { useEffect } from "react";

import { HOME_ROUTE, SIGN_IN_ROUTE } from "@/lib/auth";
import { useAuth } from "@/components/auth/auth-provider";

export default function RootLanding() {
  const { ready, sessionId } = useAuth();

  useEffect(() => {
    console.log("[root-landing] state", { ready, sessionId });
  }, [ready, sessionId]);

  if (!ready) {
    return null;
  }

  if (sessionId) {
    console.log("[root-landing] redirecting to home");
    return <Redirect href={HOME_ROUTE} />;
  }

  console.log("[root-landing] redirecting to sign in");
  return <Redirect href={SIGN_IN_ROUTE} />;
}
