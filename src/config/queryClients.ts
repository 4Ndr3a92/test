import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import {
  QueryClient,
} from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: 0,
    },
  },
});


export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'ALCANTARA_QUERY_CACHE',
  throttleTime: 1000, // scrive su disco al massimo ogni 1s, evita troppi I/O
});