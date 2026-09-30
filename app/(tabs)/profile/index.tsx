import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { useAuthStore } from '../../../src/features/auth/store/authStore';
import { AuthScreen } from '@/features/auth/screen/AuthScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';


export default function Page() {
  const user = useAuthStore((s) => s.user);
  return user ? <ProfileScreen /> : <AuthScreen />;
}