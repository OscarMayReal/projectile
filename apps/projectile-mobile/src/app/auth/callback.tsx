import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/components/auth/auth-provider";
import { HOME_ROUTE } from "@/lib/auth";

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const { sessionId, completeSession, error } = useAuth();

  const sessionFromUrl = Array.isArray(params.sessionId)
    ? params.sessionId[0]
    : params.sessionId;

  useEffect(() => {
    console.log("[auth-callback] params", params);
    console.log("[auth-callback] session state", { sessionId, sessionFromUrl, error });
    if (!sessionFromUrl || sessionId) {
      return;
    }

    void completeSession(sessionFromUrl).catch((err) => {
      console.error("[auth-callback] completeSession failed", err);
    });
  }, [completeSession, sessionFromUrl, sessionId]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    console.log("[auth-callback] auth complete, redirecting home");
    router.replace(HOME_ROUTE);
  }, [router, sessionId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finishing sign-in</Text>
      <Text style={styles.subtitle}>
        We are bringing your Keystone session into Projectile.
      </Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#0B1020",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(248, 250, 252, 0.78)",
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 360,
  },
  errorText: {
    color: "#FCA5A5",
    marginTop: 16,
    maxWidth: 360,
    lineHeight: 20,
  },
});
