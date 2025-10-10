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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Role, UserStatus } from '@/app/types/auth';
import { usersAPI } from '@/services/api/users';
import { userSchema } from '@/schemas/user.schema';
import { useAuth } from '@/context/AuthContext';

// Tipagem derivada do schema (apenas os campos que constam no schema)
type UserFormValues = z.infer<typeof userSchema> & {
  // senha não está no schema original — mantemos aqui para enviar ao backend
  senha?: string;
};

export default function NewUserPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const canCreateRole = currentUser?.role === Role.ADMIN;

  const onSubmit = async (values: UserFormValues) => {
    const payload = {
      nome: values.nome,
      usuario: values.usuario,
      perfil: values.perfil,
      senha: values.senha,
    };

    await usersAPI.create(payload);
    router.push('/users');
  };

  return (
    <Container maxW="container.md">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Usuários</Heading>

          <Button as={NextLink} href="/users/new" colorScheme="brand" variant="solid">
            Novo Usuário
          </Button>
        </HStack>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!(errors as any).name}>
                  <FormLabel>Nome Completo</FormLabel>
                  <Input {...register('nome')} placeholder="João Silva" />
                  <FormErrorMessage>{(errors as any).name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!(errors as any).email}>
                  <FormLabel>Usuário</FormLabel>
                  <Input {...register('usuario')} placeholder="joao@exemplo.com" />
                  <FormErrorMessage>{(errors as any).email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Senha</FormLabel>
                  <Input {...register('senha')} type="password" placeholder="••••••" />
                  <FormErrorMessage>{(errors as any).senha?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!(errors as any).role}>
                  <FormLabel>Perfil</FormLabel>
                  <Select {...(register('perfil') as any)} placeholder="Selecione o perfil">
                    {canCreateRole && (
                      <>
                        <option value="admin">Administrador</option>
                        <option value="professor">Professor</option>
                      </>
                    )}
                    <option value="aluno">Aluno</option>
                  </Select>
                  <FormErrorMessage>{(errors as any).role?.message}</FormErrorMessage>
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
                    Criar Usuário
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
