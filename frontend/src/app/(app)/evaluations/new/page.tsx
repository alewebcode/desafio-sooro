'use client';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  VStack,
  Card,
  CardBody,
  HStack,
  useToast,
  Select,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { evaluationsAPI } from '@/services/api/evaluations';
import { usersAPI } from '@/services/api/users';

const evaluationSchema = z.object({
  id_usuario_aluno: z.string().min(1, 'Selecione um aluno'),
  altura: z.number().min(0.5, 'Altura inválida').max(3, 'Altura inválida'),
  peso: z.number().min(1, 'Peso inválido').max(500, 'Peso inválido'),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

export default function NewEvaluationPage() {
  const router = useRouter();
  const toast = useToast();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const allUsers = await usersAPI.getAll();
      return allUsers.filter((u: any) => u.perfil === 'aluno');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
  });

  const onSubmit = async (values: EvaluationFormValues) => {
    try {
      await evaluationsAPI.create(values);
      toast({ title: 'Avaliação criada', status: 'success', duration: 3000 });
      router.push('/evaluations');
    } catch (err: any) {
      toast({
        title: 'Erro ao criar avaliação',
        description: err?.message || 'Tente novamente',
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (isLoading)
    return (
      <Center py={10}>
        <Spinner />
      </Center>
    );

  if (isError)
    return (
      <Center py={10}>
        <Text color="red.500">Erro ao carregar alunos</Text>
      </Center>
    );

  return (
    <Container maxW="container.md">
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Nova Avaliação</Heading>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.id_usuario_aluno}>
                  <FormLabel>Aluno</FormLabel>
                  <Select {...register('id_usuario_aluno')} placeholder="Selecione um aluno">
                    {users?.map((user: any) => (
                      <option key={user.id} value={user.id}>
                        {user.nome}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.id_usuario_aluno?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.altura}>
                  <FormLabel>Altura (m)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('altura', { valueAsNumber: true })}
                    placeholder="1.75"
                  />
                  <FormErrorMessage>{errors.altura?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.peso}>
                  <FormLabel>Peso (kg)</FormLabel>
                  <Input
                    type="number"
                    step="0.1"
                    {...register('peso', { valueAsNumber: true })}
                    placeholder="70"
                  />
                  <FormErrorMessage>{errors.peso?.message}</FormErrorMessage>
                </FormControl>

                <HStack width="full" justify="flex-end" spacing={4} pt={4}>
                  <Button variant="ghost" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    isLoading={isSubmitting}
                    loadingText="Salvando..."
                  >
                    Salvar Avaliação
                  </Button>
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
