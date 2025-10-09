'use client';

import { Box, Heading, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const logout = () => {
    document.cookie = 'accessToken=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Dashboard</Heading>
    </Box>
  );
}
