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
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { evaluationsAPI } from '@/services/api/evaluations';
import { usersAPI } from '@/services/api/users';
import { useEffect } from 'react';

const evaluationSchema = z.object({
  id_usuario_aluno: z.string().min(1, 'Selecione um aluno'),
  altura: z.number().min(0.5, 'Altura inválida').max(3, 'Altura inválida'),
  peso: z.number().min(1, 'Peso inválido').max(500, 'Peso inválido'),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

export default function EditEvaluationPage() {
  const router = useRouter();
  const params = useParams(); // espera que a rota seja /evaluations/[id]/edit
  const evaluationId = params?.id as string | undefined;
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
  });

  // Buscar avaliação
  const { data: evaluation, isLoading: loadingEvaluation } = useQuery({
    queryKey: ['evaluation', evaluationId],
    queryFn: async () => {
      if (!evaluationId) return null;

      return evaluationsAPI.getById(evaluationId);
    },
  });

  // Buscar alunos
  const {
    data: users,
    isLoading: loadingUsers,
    isError,
  } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const allUsers = await usersAPI.getAll();
      return allUsers.filter((u: any) => u.perfil === 'aluno');
    },
  });

  // Popular formulário quando os dados da avaliação forem carregados
  useEffect(() => {
    console.log('Avaliação carregada:', evaluation);
    if (evaluation) {
      reset({
        id_usuario_aluno: evaluation.student.id,
        altura: evaluation.altura,
        peso: evaluation.peso,
      });
    }
  }, [evaluation, reset]);

  const onSubmit = async (values: EvaluationFormValues) => {
    try {
      await evaluationsAPI.update(evaluationId!, values);
      toast({ title: 'Avaliação atualizada', status: 'success', duration: 3000 });
      router.push('/evaluations');
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar avaliação',
        description: err?.message || 'Tente novamente',
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (loadingEvaluation || loadingUsers)
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
        <Heading size="lg">Editar Avaliação</Heading>

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
                    Atualizar Avaliação
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
