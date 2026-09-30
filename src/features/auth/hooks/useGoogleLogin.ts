import { useMutation } from '@tanstack/react-query';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';

import { Alert } from 'react-native';
import { supabase } from '@/config/supabase';

// Configurazione iniziale di Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // o la stringa '...apps.googleusercontent.com'
  scopes: ['profile', 'email'],
});

const performGoogleLogin = async () => {
  // 1. Verificare che i Play Services siano disponibili su Android
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  // 2. Avviare il flusso di login per recuperare l'idToken
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;

  if (!idToken) {
    throw new Error('Impossibile recuperare l\'ID Token da Google.');
  }

  // 3. Autenticare l'utente su Supabase inviando l'idToken
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: performGoogleLogin,
    onError: (error: any) => {
      console.log(error)
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('Login annullato dall\'utente');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Operazione di login già in corso');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Errore', 'Google Play Services non disponibili o non aggiornati.');
            break;
          case '10': // DEVELOPER_ERROR
            console.log('DEVELOPER_ERROR (10): Verificare SHA-1 su EAS e Google Cloud Console per il package com.alcatrails');

            break;
          default:
            Alert.alert('Errore Login', error.message || 'Si è verificato un errore durante l\'accesso con Google.');
        }
      } else {
        console.error('Errore Supabase/Rete:', error);
        Alert.alert('Errore Autenticazione', error?.message || 'Impossibile completare la registrazione su Supabase.');
      }
    },
  });
};