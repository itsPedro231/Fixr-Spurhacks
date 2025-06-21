import React, { useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useRouter, useSegments } from 'expo-router';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === 'auth';

      if (!user && !inAuthGroup) {
        // User is not authenticated and not in auth screens, redirect to auth
        router.replace('/auth');
      } else if (user && inAuthGroup) {
        // User is authenticated but in auth screens, redirect to main app
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, segments]);

  // Show loading screen while checking authentication
  if (loading) {
    return null; // Or you can show a loading spinner here
  }

  return <>{children}</>;
}
