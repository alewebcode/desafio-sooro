// app/(app)/users/page.tsx
'use client';

import { Box, Heading, Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import EvaluationTable from '@/components/EvaluationTable';

export default function EvaluationsPage() {
  const router = useRouter();

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Avaliações</Heading>
        <Button colorScheme="blue" onClick={() => router.push('/evaluations/new')}>
          Nova Avaliação
        </Button>
      </Flex>

      <EvaluationTable />
    </Box>
  );
}
