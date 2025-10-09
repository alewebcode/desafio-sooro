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
import { api } from '@/services/api';

// Validação com Zod
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
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setLoading(true);
      const response = await api.post('/authenticate', data);

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Strict`;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Strict`;

      router.push('/dashboard'); // Redireciona para página protegida
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.response?.data?.message || error.message,
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
