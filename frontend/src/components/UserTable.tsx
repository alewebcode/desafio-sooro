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
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  situacao: string;
}

async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get('/users');
  console.log(data);
  return data;
}

export default function UserTable() {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

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
          <Th>Email</Th>
          <Th>Perfil</Th>
          <Th>Status</Th>
          <Th>Ações</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data?.map((user) => (
          <Tr key={user.id}>
            <Td>{user.nome}</Td>
            <Td>{user.email}</Td>
            <Td>
              <Badge colorScheme="blue">{user.perfil}</Badge>
            </Td>
            <Td>
              <Badge colorScheme={user.situacao === 'ativo' ? 'green' : 'red'}>
                {user.situacao}
              </Badge>
            </Td>
            <Td>
              <IconButton
                aria-label="Editar usuário"
                icon={<FiEdit />}
                size="sm"
                colorScheme="blue"
                onClick={() => router.push(`/users/${user.id}/edit`)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
