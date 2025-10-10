'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Spinner, Center } from '@chakra-ui/react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isMounted, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isMounted) return;
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isMounted, isLoading, isAuthenticated, router]);

  if (!isMounted || isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user?.name}!</p>
    </div>
  );
}
