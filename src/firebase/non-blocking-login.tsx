
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getFirestore } from 'firebase/firestore';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up and create a user document in Firestore. */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string, displayName: string): Promise<void> {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    const user = userCredential.user;

    if (user) {
      // 1. Update the user's auth profile
      await updateProfile(user, { displayName });

      // 2. Create a document in Firestore for the user
      const firestore = getFirestore(authInstance.app);
      const userDocRef = doc(firestore, 'users', user.uid);
      
      await setDoc(userDocRef, {
        id: user.uid,
        displayName: displayName,
        email: user.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        photoURL: null,
        bio: '',
        company: ''
      });
    }
  } catch (error) {
    console.error("Error during sign up:", error);
    // Optionally, re-throw or handle the error in the UI
  }
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password);
}
