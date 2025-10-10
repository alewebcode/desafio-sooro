'use client';
import NextLink from 'next/link';
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
  Select,
  Card,
  CardBody,
  HStack,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useParams } from 'next/navigation';
import { z } from 'zod';
import { useEffect, useState } from 'react';

import { usersAPI } from '@/services/api/users';
import { EditUserForm, editUserSchema, userSchema } from '@/schemas/user.schema';

// Tipagem derivada do schema (apenas os campos que constam no schema)
type UserFormValues = z.infer<typeof editUserSchema> & {
  senha?: string;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const id = params?.id as string | undefined;

  const [loading, setLoading] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    async function load(userId: string) {
      try {
        const user = await usersAPI.getById(userId);
        console.log(user);
        const mapped = {
          nome: (user.nome ?? user.nome) as string,
          usuario: (user.usuario ?? user.usuario) as string,
          senha: '',
          perfil: (user.perfil ?? 'aluno').toLowerCase() as 'admin' | 'professor' | 'aluno',
        };
        reset(mapped);
      } catch (err: any) {
        console.error(err);
        toast({
          title: 'Erro ao carregar usuário',
          description: err?.message || 'Verifique a conexão',
          status: 'error',
        });
      } finally {
        setLoading(false);
      }
    }

    load(id);
  }, [id, reset, toast]);

  const onSubmit = async (values: UserFormValues) => {
    if (!id) {
      toast({ title: 'ID do usuário não encontrado', status: 'error' });
      return;
    }

    const payload = {
      nome: values.nome,
      usuario: values.usuario,
      perfil: values.perfil,
      ...(values.senha ? { senha: values.senha } : {}),
    };

    try {
      await usersAPI.update(id, payload);
      toast({ title: 'Usuário atualizado', status: 'success' });
      router.push('/users');
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Erro ao atualizar',
        description: err?.response?.data?.message || err?.message || 'Tente novamente',
        status: 'error',
      });
    }
  };

  if (!id) {
    return (
      <Center p={8}>
        <Heading size="md">ID do usuário não informado na URL</Heading>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center p={8}>
        <Spinner />
      </Center>
    );
  }

  return (
    <Container maxW="container.md">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Editar Usuário</Heading>

          <Button as={NextLink} href="/users/new" colorScheme="brand" variant="solid">
            Novo Usuário
          </Button>
        </HStack>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                {/* Nome */}
                <FormControl isInvalid={!!(errors as any).nome}>
                  <FormLabel>Nome Completo</FormLabel>
                  <Input {...register('nome' as any)} placeholder="João Silva" />
                  <FormErrorMessage>{(errors as any).nome?.message}</FormErrorMessage>
                </FormControl>

                {/* Usuário / usuario */}
                <FormControl isInvalid={!!(errors as any).usuario}>
                  <FormLabel>Usuário (usuario)</FormLabel>
                  <Input {...register('usuario' as any)} placeholder="joao@exemplo.com" />
                  <FormErrorMessage>{(errors as any).usuario?.message}</FormErrorMessage>
                </FormControl>

                {/* Senha */}
                <FormControl>
                  <FormLabel>Senha </FormLabel>
                  <Input {...register('senha')} type="password" placeholder="••••••" />
                  <FormErrorMessage>{(errors as any).senha?.message}</FormErrorMessage>
                </FormControl>

                {/* Perfil */}
                <FormControl isInvalid={!!(errors as any).perfil}>
                  <FormLabel>Perfil</FormLabel>
                  <Select {...register('perfil' as any)} placeholder="Selecione o perfil">
                    <option value="admin">Administrador</option>
                    <option value="professor">Professor</option>
                    <option value="aluno">Aluno</option>
                  </Select>
                  <FormErrorMessage>{(errors as any).perfil?.message}</FormErrorMessage>
                </FormControl>

                {/* Ações */}
                <HStack width="full" justify="flex-end" spacing={4} pt={4}>
                  <Button variant="ghost" onClick={() => router.back()}>
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    isLoading={isSubmitting}
                    loadingText="Salvando..."
                  >
                    Salvar alterações
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
