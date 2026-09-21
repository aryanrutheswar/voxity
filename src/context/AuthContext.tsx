'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const ADMIN_EMAILS = [
  'aryanrutheswar1823@gmail.com',
  'aryanrutheswar@1823@gmail.com'
];

export interface AuthUser {
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
  photoURL?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser, token: string) => void;
  loginWithGoogle: () => Promise<{ user: AuthUser; redirectUrl: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children?: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser && fbUser.email) {
        const userEmail = fbUser.email.toLowerCase();
        const isAdmin = ADMIN_EMAILS.some(ae => ae.toLowerCase() === userEmail);
        const role: 'ADMIN' | 'USER' = isAdmin ? 'ADMIN' : 'USER';

        const authUser: AuthUser = {
          email: fbUser.email,
          role,
          name: fbUser.displayName || fbUser.email.split('@')[0],
          photoURL: fbUser.photoURL
        };

        const idToken = await fbUser.getIdToken();
        setUser(authUser);
        localStorage.setItem('aetheris_user', JSON.stringify(authUser));
        localStorage.setItem('aetheris_token', idToken);
      } else {
        // Fallback check localStorage for legacy session if firebase user is null
        const savedUser = localStorage.getItem('aetheris_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            console.error('Failed to parse saved auth user', e);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData: AuthUser, token: string) => {
    setUser(userData);
    localStorage.setItem('aetheris_user', JSON.stringify(userData));
    localStorage.setItem('aetheris_token', token);
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      if (!fbUser.email) {
        throw new Error('Google Sign-In failed: Email not provided.');
      }

      const userEmail = fbUser.email.toLowerCase();
      const isAdmin = ADMIN_EMAILS.some(ae => ae.toLowerCase() === userEmail);
      const role: 'ADMIN' | 'USER' = isAdmin ? 'ADMIN' : 'USER';
      const redirectUrl = isAdmin ? '/admin' : '/dashboard';

      const authUser: AuthUser = {
        email: fbUser.email,
        role,
        name: fbUser.displayName || fbUser.email.split('@')[0],
        photoURL: fbUser.photoURL
      };

      const idToken = await fbUser.getIdToken();
      setUser(authUser);
      localStorage.setItem('aetheris_user', JSON.stringify(authUser));
      localStorage.setItem('aetheris_token', idToken);

      return { user: authUser, redirectUrl };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error('Firebase sign-out error', e);
    }
    setUser(null);
    localStorage.removeItem('aetheris_user');
    localStorage.removeItem('aetheris_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
