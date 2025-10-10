// app/(app)/users/page.tsx
'use client';

import { Box, Heading, Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import UserTable from '@/components/UserTable';

export default function UsersPage() {
  const router = useRouter();

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Usuários</Heading>
        <Button colorScheme="blue" onClick={() => router.push('/users/new')}>
          Novo Usuário
        </Button>
      </Flex>

      <UserTable />
    </Box>
  );
}
