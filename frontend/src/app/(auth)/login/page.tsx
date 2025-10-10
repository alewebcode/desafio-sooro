'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  VStack,
  useToast,
} from '@chakra-ui/react';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  user: z.string().min(3, 'Usuário obrigatório'),
  password: z.string().min(8, 'Senha obrigatória e deve ter no mínimo 8 caracteres'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const toast = useToast();
  const router = useRouter();
  const { login } = useAuth(); // <<-- pega a função do AuthProvider
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      // chama a função do AuthProvider (que usa authAPI por baixo)
      await login(data.user, data.password);

      router.push('/dashboard');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Erro desconhecido ao tentar logar';

      toast({
        title: 'Erro ao fazer login',
        description: message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" p={4}>
      <Box bg="white" p={8} borderRadius="md" boxShadow="lg" width={{ base: '100%', sm: '400px' }}>
        <Heading mb={6} textAlign="center">
          Login
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.user}>
              <FormLabel>Usuário</FormLabel>
              <Input type="text" {...register('user')} />
              <FormErrorMessage>{errors.user?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Senha</FormLabel>
              <Input type="password" {...register('password')} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <Button
              colorScheme="blue"
              type="submit"
              width="full"
              isLoading={loading || isSubmitting}
            >
              Entrar
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
