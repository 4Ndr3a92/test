import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { TrailPOI } from '../types';

const CHANNEL_ID = 'tracking';

export async function initialize() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const permissions = await Notifications.getPermissionsAsync();

  if (permissions.status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }

  await Notifications.dismissAllNotificationsAsync();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Tracking',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}

const getAndroidChannel = () => (Platform.OS === 'android' ? { channelId: CHANNEL_ID } : {});

export async function sendPoi(poi: TrailPOI) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: poi.name,
      body: poi.description,
      sound: 'default',
      ...getAndroidChannel(),
    },
    trigger: null,
  });
}

export async function sendOffRoute(distance: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Fuori percorso',
      body: `Ti sei allontanato di ${Math.round(distance)} m dal sentiero.`,
      sound: 'default',
      ...getAndroidChannel(),
    },
    trigger: null,
  });
}

export async function sendFinish(trailName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Percorso completato',
      body: `Hai completato "${trailName}". Complimenti!`,
      sound: 'default',
      ...getAndroidChannel(),
    },
    trigger: null,
  });
}

export async function cancelAll() {
  await Notifications.dismissAllNotificationsAsync();
  await Notifications.cancelAllScheduledNotificationsAsync();
}