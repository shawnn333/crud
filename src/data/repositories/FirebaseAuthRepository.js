import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository.js';
import { auth } from '../firebase/firebaseConfig.js';

function mapUser(firebaseUser) {
  if (!firebaseUser) return null;
  return { uid: firebaseUser.uid, email: firebaseUser.email };
}

function friendlyMessage(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with that email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    default:
      return error?.message || 'Something went wrong. Please try again.';
  }
}

export class FirebaseAuthRepository extends IAuthRepository {
  async login(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return mapUser(cred.user);
    } catch (error) {
      throw new Error(friendlyMessage(error));
    }
  }

  async register(email, password) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      return mapUser(cred.user);
    } catch (error) {
      throw new Error(friendlyMessage(error));
    }
  }

  async logout() {
    await signOut(auth);
  }

  getCurrentUser() {
    return mapUser(auth.currentUser);
  }

  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(mapUser(firebaseUser));
    });
  }
}
