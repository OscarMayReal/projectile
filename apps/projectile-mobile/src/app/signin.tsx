import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/components/auth/auth-provider";
import { HOME_ROUTE } from "@/lib/auth";

export default function Index() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const { ready, sessionId, signingIn, error, signIn, completeSession, clearError } = useAuth();

  const sessionFromUrl = Array.isArray(params.sessionId)
    ? params.sessionId[0]
    : params.sessionId;

  useEffect(() => {
    console.log("[signin] params", params);
    console.log("[signin] state", { ready, sessionId, signingIn, error, sessionFromUrl });
    if (!sessionFromUrl || sessionId) {
      return;
    }

    void completeSession(sessionFromUrl).catch((err) => {
      console.error("[signin] completeSession failed", err);
    });
  }, [completeSession, ready, sessionFromUrl, sessionId, signingIn, error, params]);

  useEffect(() => {
    if (!ready || !sessionId) {
      return;
    }

    console.log("[signin] auth complete, redirecting home");
    router.replace(HOME_ROUTE);
  }, [ready, router, sessionId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projectile</Text>
      <Text style={styles.subtitle}>
        Sign in with Keystone to keep your mobile session in sync with the web app.
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          signingIn && styles.buttonDisabled,
        ]}
        onPress={() => {
          console.log("[signin] button pressed");
          clearError();
          void signIn().catch((err) => {
            console.error("[signin] signIn failed", err);
          });
        }}
        disabled={signingIn}
      >
        <Text style={styles.buttonText}>
          {signingIn ? "Opening Keystone..." : "Continue with Keystone"}
        </Text>
      </Pressable>
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
    fontSize: 40,
    fontWeight: "700",
    letterSpacing: -0.8,
    marginBottom: 12,
  },
  subtitle: {
    color: "rgba(248, 250, 252, 0.78)",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 360,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#22C55E",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#08111F",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: "#FCA5A5",
    marginTop: 16,
    maxWidth: 360,
    lineHeight: 20,
  },
});
