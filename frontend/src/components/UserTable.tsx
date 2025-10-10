'use client';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
  IconButton,
  Text,
  Badge,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { FiEdit, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { usersAPI } from '@/services/api/users';
import { useAuth } from '@/context/AuthContext';

interface User {
  id: string;
  nome: string;
  perfil: string;
  situacao: string;
}

async function fetchUsers(): Promise<User[]> {
  return await usersAPI.getAll();
}

export default function UserTable() {
  const toast = useToast();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  if (!currentUser) return null;

  const { data, isLoading, isError, refetch } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Deseja realmente excluir este usuário?');
    if (!confirmed) return;

    try {
      await usersAPI.delete(id);
      toast({
        title: 'Usuário excluído',
        status: 'success',
        duration: 3000,
      });
      refetch(); // atualiza a lista
    } catch (err: any) {
      toast({
        title: 'Erro ao excluir usuário',
        description: err?.message || 'Tente novamente',
        status: 'error',
        duration: 5000,
      });
    }
  };
  const handleToggleStatus = async (user: User) => {
    const newStatus = user.situacao === 'ativo' ? 'inativo' : 'ativo';

    try {
      await usersAPI.update(user.id, { situacao: newStatus });
      toast({
        title: `Usuário ${newStatus === 'ativo' ? 'ativado' : 'inativado'}`,
        status: 'success',
        duration: 3000,
      });
      refetch();
    } catch (err: any) {
      toast({
        title: 'Erro ao atualizar status',
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
        <Text color="red.500">Erro ao carregar usuários</Text>
      </Center>
    );

  return (
    <Table variant="striped" colorScheme="gray">
      <Thead>
        <Tr>
          <Th>Nome</Th>
          <Th>Perfil</Th>
          <Th>Status</Th>
          <Th>Ações</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.map((user) => (
          <Tr key={user.id}>
            <Td>{user.nome}</Td>
            <Td>{user.perfil}</Td>
            <Td>
              <Badge colorScheme={user.situacao === 'ativo' ? 'green' : 'red'}>
                {user.situacao}
              </Badge>
            </Td>
            <Td>
              <HStack spacing={2}>
                {currentUser.role === 'admin' && (
                  <IconButton
                    aria-label={user.situacao === 'ativo' ? 'Inativar usuário' : 'Ativar usuário'}
                    icon={user.situacao === 'ativo' ? <FiToggleLeft /> : <FiToggleRight />}
                    size="sm"
                    colorScheme={user.situacao === 'ativo' ? 'orange' : 'green'}
                    onClick={() => handleToggleStatus(user)}
                  />
                )}

                <IconButton
                  aria-label="Editar usuário"
                  icon={<FiEdit />}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => router.push(`/users/${user.id}/edit`)}
                />
                {currentUser.role === 'admin' && (
                  <IconButton
                    aria-label="Excluir usuário"
                    icon={<FiTrash2 />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(user.id)}
                  />
                )}
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
