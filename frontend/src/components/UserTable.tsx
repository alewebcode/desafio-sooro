'use client';

import React from 'react';
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
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

  const { user: currentUser, isMounted, isLoading: authLoading } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: !!currentUser,
  });

  // --- Modal state ---
  const [isOpen, setIsOpen] = React.useState(false);
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [actionType, setActionType] = React.useState<'delete' | 'toggle' | null>(null);

  const openConfirm = (type: 'delete' | 'toggle', user: User) => {
    // Prevent admin from deleting self (optional UX guard)
    if (type === 'delete' && currentUser?.id === user.id) {
      toast({ title: 'Você não pode excluir seu próprio usuário', status: 'warning' });
      return;
    }
    // Prevent toggling own status (optional)
    if (type === 'toggle' && currentUser?.id === user.id) {
      toast({ title: 'Você não pode alterar seu próprio status aqui', status: 'warning' });
      return;
    }

    setSelectedUser(user);
    setActionType(type);
    setIsOpen(true);
  };

  const closeConfirm = () => {
    setIsOpen(false);
    setIsProcessing(false);
    setSelectedUser(null);
    setActionType(null);
  };

  const handleConfirm = async () => {
    if (!selectedUser || !actionType) return;
    setIsProcessing(true);

    try {
      if (actionType === 'delete') {
        await usersAPI.delete(selectedUser.id);
        toast({ title: 'Usuário excluído', status: 'success', duration: 3000 });
      } else if (actionType === 'toggle') {
        const newStatus = selectedUser.situacao === 'ativo' ? 'inativo' : 'ativo';
        await usersAPI.update(selectedUser.id, { situacao: newStatus });
        toast({
          title: `Usuário ${newStatus === 'ativo' ? 'ativado' : 'inativado'}`,
          status: 'success',
          duration: 3000,
        });
      }
      await refetch();
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Tente novamente';
      toast({
        title: 'Erro',
        description: message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      closeConfirm();
    }
  };

  // --- auth / loading states ---
  if (!isMounted || authLoading) {
    return (
      <Center py={10}>
        <Spinner size="lg" color="brand.500" />
      </Center>
    );
  }

  if (!currentUser) {
    return (
      <Center py={10}>
        <Text color="red.500">Usuário não autenticado</Text>
      </Center>
    );
  }

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center py={10}>
        <Text color="red.500">Erro ao carregar usuários</Text>
      </Center>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Center py={10}>
        <Text color="gray.500">Nenhum usuário encontrado</Text>
      </Center>
    );
  }

  return (
    <>
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
          {data.map((user) => (
            <Tr key={user.id}>
              <Td>{user.nome}</Td>
              <Td>
                <Badge
                  colorScheme={
                    user.perfil === 'admin'
                      ? 'purple'
                      : user.perfil === 'professor'
                        ? 'blue'
                        : 'green'
                  }
                >
                  {user.perfil}
                </Badge>
              </Td>
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
                      onClick={() => openConfirm('toggle', user)}
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
                      onClick={() => openConfirm('delete', user)}
                    />
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeConfirm}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {actionType === 'delete'
                ? 'Confirmar exclusão'
                : actionType === 'toggle'
                  ? selectedUser?.situacao === 'ativo'
                    ? 'Inativar usuário'
                    : 'Ativar usuário'
                  : 'Confirmação'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {actionType === 'delete' ? (
                <>
                  Tem certeza que deseja excluir o usuário <strong>{selectedUser?.nome}</strong>?
                  Esta ação não pode ser desfeita.
                </>
              ) : actionType === 'toggle' ? (
                selectedUser?.situacao === 'ativo' ? (
                  <>
                    Tem certeza que deseja inativar o usuário <strong>{selectedUser?.nome}</strong>?
                    Ele não poderá acessar o sistema enquanto inativo.
                  </>
                ) : (
                  <>
                    Tem certeza que deseja ativar o usuário <strong>{selectedUser?.nome}</strong>?
                  </>
                )
              ) : (
                <>Deseja confirmar a ação?</>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeConfirm}>
                Cancelar
              </Button>
              <Button
                colorScheme={actionType === 'delete' ? 'red' : 'blue'}
                onClick={handleConfirm}
                ml={3}
                isLoading={isProcessing}
              >
                {actionType === 'delete' ? 'Excluir' : 'Confirmar'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
