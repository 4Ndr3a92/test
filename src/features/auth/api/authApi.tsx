import { supabase } from "@/config/supabase";



export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export const loginWithEmail = async ({ email, password }: LoginPayload) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

export const registerWithEmail = async ({ email, password, name }: RegisterPayload) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) throw error;
  return data.user;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
export const loginWithGoogleNative = async (idToken: string) => {

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });
  if (error) throw error;
  return data.user;
};

export const loginWithAppleNative = async ({ token, nonce }: { token: string; nonce: string }) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token,
    nonce,
  });
  if (error) throw error;
  return data.user;
};

export const loginWithOAuth = async (provider: 'google'  |'apple') => {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) throw error;
  return data;
};