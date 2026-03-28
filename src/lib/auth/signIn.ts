import { getAuth, signInAnonymously, signInWithEmailAndPassword, OAuthProvider, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

/**
 * Handles all provider-based Auth methods specified in Product Bible.
 */

// 1. Email and Password
export async function signInEmail(email: string, pass: string) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, pass);
}

// 2. Sign in with Apple (Provider logic via standard OAuth or expo-apple-authentication)
// Note: This relies on Expo Apple Auth extracting an identity token.
export async function signInApple(idToken: string, rawNonce: string) {
  const auth = getAuth();
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({
    idToken,
    rawNonce
  });
  return signInWithCredential(auth, credential);
}

// 3. Sign in with Google
export async function signInGoogle(idToken: string) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

// 4. Optional anonymous guest mode for onboarding/MVP trial flow
export async function signInGuest() {
  const auth = getAuth();
  return signInAnonymously(auth);
}
