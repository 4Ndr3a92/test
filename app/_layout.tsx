import { Stack, } from 'expo-router'
import { useEffect } from 'react'

import { asyncStoragePersister, queryClient } from '@/config/queryClients'
import { supabase } from '@/config/supabase'
import { useAuthStore } from '@/features/auth/store/authStore'
import { colors } from '@/shared/theme'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '../src/shared/i18n/i18n'
import { QueryClientProvider } from '@tanstack/react-query'

import { initialize } from '@/features/tracking/services/notificationService'

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isInitializing = useAuthStore((s) => s.isInitializing);
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);
  useEffect(() => {
      initialize();
  }, []);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setInitializing(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, [setUser, setInitializing]);

  if (isInitializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <AuthGate>
      
                <Stack screenOptions={{ headerShown: false, }}>
                  <Stack.Screen name="(tabs)" 
                            options={{
                            headerShown: false,
                            presentation: 'fullScreenModal',
                            animation: 'slide_from_bottom',
                            animationDuration: 500
                            }}
                  />
                        <Stack.Screen
                          name="trails/[id]"
                          options={{
                            headerShown: false,
                            presentation: 'fullScreenModal',
                            animation: 'slide_from_bottom',
                            animationDuration: 500
                            }}
                        />
                                                <Stack.Screen
                          name="pois/[id]"
                          options={{
                            headerShown: false,
                            presentation: 'fullScreenModal',
                            animation: 'slide_from_bottom',
                            animationDuration: 500
                            }}
                        />
                </Stack>
     
            </AuthGate>
          </SafeAreaProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
});