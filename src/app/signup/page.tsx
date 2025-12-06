import { AuthForm } from '@/components/auth/auth-form';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function SignUpPage() {
  return (
    <FirebaseClientProvider>
      <AuthForm isSignUp={true} />
    </FirebaseClientProvider>
  );
}
