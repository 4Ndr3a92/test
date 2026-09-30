import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useTranslation } from "react-i18next";
import { AuthHero } from "../components/AuthHero";
import { AuthTabs } from "../components/AuthTabs";
import { SocialLoginRow } from "../components/SocialLoginRow";
import { TextField } from "@/shared/components/TextField";
import { useAuthStore } from "../store/authStore";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";
import { useAppleLogin } from "../hooks/useAppleLogin";
import { useGoogleLogin } from "../hooks/useGoogleLogin";

import { colors, spacing, radius, typography } from "@/shared/theme";

const mapSupabaseError = (message: string, t: (k: string) => string) => {
  if (message.includes("Invalid login credentials"))
    return t("auth.errors.wrongPassword");
  if (message.includes("User already registered"))
    return t("auth.errors.emailInUse");
  if (message.includes("Password should be at least"))
    return t("auth.errors.weakPassword");
  if (message.includes("Unable to validate email"))
    return t("auth.errors.invalidEmail");
  return t("auth.errors.generic");
};

export const AuthScreen = () => {
  const { t } = useTranslation();
  const mode = useAuthStore((s) => s.mode);
  const setMode = useAuthStore((s) => s.setMode);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const googleLoginMutation = useGoogleLogin();
  const appleLoginMutation = useAppleLogin();
  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    googleLoginMutation.isPending;

  const handleModeChange = (newMode: "login" | "register") => {
    setErrorMessage(null);
    setMode(newMode);
  };

  const handleSubmit = () => {
    setErrorMessage(null);

    // Controlli di validazione client-side
    if (mode === "register" && !name.trim()) {
      setErrorMessage(t("auth.errors.nameRequired", "Inserisci il nome"));
      return;
    }

    if (!email.trim()) {
      setErrorMessage(t("auth.errors.emailRequired", "Inserisci l'email"));
      return;
    }

    if (!password) {
      setErrorMessage(t("auth.errors.passwordRequired", "Inserisci la password"));
      return;
    }

    if (mode === "login") {
      loginMutation.mutate(
        { email, password },
        {
          onError: (err) =>
            setErrorMessage(mapSupabaseError((err as Error).message, t)),
        }
      );
    } else {
      registerMutation.mutate(
        { email, password, name: name.trim() },
        {
          onError: (err) =>
            setErrorMessage(mapSupabaseError((err as Error).message, t)),
        }
      );
    }
  };

  const handleGoogleLogin = () => {
    setErrorMessage(null);
    googleLoginMutation.mutate(undefined, {
      onError: (err) =>
        setErrorMessage(mapSupabaseError((err as Error).message, t)),
    });
  };

  const handleAppleLogin = () => {
    setErrorMessage(null);
    appleLoginMutation.mutate(undefined, {
      onError: (err) =>
        setErrorMessage(mapSupabaseError((err as Error).message, t)),
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "position" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? -60 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <AuthHero />

            <View style={styles.sheet}>
              <AuthTabs mode={mode} onChange={handleModeChange} />

              {mode === "register" && (
                <TextField
                  icon="person-outline"
                  placeholder={t("auth.name")}
                  value={name}
                  onChangeText={(val) => {
                    if (errorMessage) setErrorMessage(null);
                    setName(val);
                  }}
                  autoCapitalize="words"
                />
              )}

              <TextField
                icon="mail-outline"
                placeholder={t("auth.email")}
                value={email}
                onChangeText={(val) => {
                  if (errorMessage) setErrorMessage(null);
                  setEmail(val);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextField
                icon="lock-closed-outline"
                placeholder={t("auth.password")}
                value={password}
                onChangeText={(val) => {
                  if (errorMessage) setErrorMessage(null);
                  setPassword(val);
                }}
                isPassword
              />

              {/* Banner per il messaggio di errore rosso */}
              {!!errorMessage && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={typography.buttonText}>
                    {mode === "login"
                      ? t("auth.loginButton")
                      : t("auth.registerButton")}
                  </Text>
                )}
              </TouchableOpacity>

              <SocialLoginRow
                onGoogle={handleGoogleLogin}
                onApple={handleAppleLogin}
              />

              <Text style={styles.legal}>
                {t("auth.termsPrefix")}{" "}
                <Text style={styles.legalLink}>{t("auth.terms")}</Text>{" "}
                {t("auth.and")}{" "}
                <Text style={styles.legalLink}>{t("auth.privacy")}</Text>.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    flexGrow: 1,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -24,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  errorContainer: {
    backgroundColor: "#FFEBEE",
    borderRadius: radius.md || 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger || "#E53935",
  },
  errorText: {
    color: colors.danger || "#E53935",
    fontSize: 13,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  submitDisabled: { opacity: 0.6 },
  legal: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.lg,
    lineHeight: 18,
  },
  legalLink: { color: colors.primary, fontWeight: "600" },
});