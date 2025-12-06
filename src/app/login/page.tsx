import { AuthForm } from '@/components/auth/auth-form';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function LoginPage() {
  return (
    <FirebaseClientProvider>
      <AuthForm isSignUp={false} />
    </FirebaseClientProvider>
  );
}
