'use client';

import React, { useMemo, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
  Text,
  Badge,
  HStack,
  useToast,
  IconButton,
  Select,
  VStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { evaluationsAPI } from '@/services/api/evaluations';
import { usersAPI } from '@/services/api/users';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { User } from '@/app/types/auth';

interface Evaluation {
  id: string;
  student: { id: string; nome: string };
  teacher: { id: string; nome: string };
  altura: number;
  peso: number;
  imc: number;
  classificacao: string;
  dtInclusao: string;
}

export default function EvaluationTable() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const {
    data: evaluations,
    isLoading: loadingEvals,
    isError: errorEvals,
    refetch,
  } = useQuery<Evaluation[]>({
    queryKey: ['evaluations'],
    queryFn: async () => {
      const resp = await evaluationsAPI.getAll();
      return resp;
    },
  });

  const { data: usersRaw, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const resp = await usersAPI.getAll(); // pode retornar UsersResponse ou User[]
      if (Array.isArray(resp)) return resp as User[];
      if ((resp as any)?.data && Array.isArray((resp as any).data))
        return (resp as any).data as User[];
      if ((resp as any)?.data?.items && Array.isArray((resp as any).data.items))
        return (resp as any).data.items as User[];
      return [];
    },
  });

  const teachers = useMemo(() => {
    if (usersRaw && usersRaw.length > 0)
      return usersRaw.filter((u) => (u as any).perfil === 'professor');

    const uniq = new Map<string, { id: string; nome: string }>();
    evaluations?.forEach((ev) => {
      if (ev.teacher && !uniq.has(ev.teacher.id))
        uniq.set(ev.teacher.id, { id: ev.teacher.id, nome: ev.teacher.nome });
    });
    return Array.from(uniq.values());
  }, [usersRaw, evaluations]);

  const students = useMemo(() => {
    if (currentUser?.role === 'professor') {
      const uniq = new Map<string, { id: string; nome: string }>();
      evaluations?.forEach((ev) => {
        if (ev.teacher?.id === currentUser.id && ev.student && !uniq.has(ev.student.id)) {
          uniq.set(ev.student.id, { id: ev.student.id, nome: ev.student.nome });
        }
      });
      return Array.from(uniq.values());
    } else {
      if (!usersRaw) return [];
      return (usersRaw as User[])
        .filter((u) => (u as any).perfil === 'aluno')
        .map((u) => ({ id: u.id, nome: u.nome }));
    }
  }, [currentUser, evaluations, usersRaw]);

  const filteredData = useMemo(() => {
    if (!evaluations) return [];
    return evaluations
      .filter((e) => {
        if (currentUser?.role === 'aluno') return e.student.id === currentUser.id;
        if (currentUser?.role === 'professor') return e.teacher.id === currentUser.id;
        return true;
      })
      .filter((e) => {
        if (selectedStudent && e.student.id !== selectedStudent) return false;
        if (selectedTeacher && e.teacher.id !== selectedTeacher) return false;
        return true;
      });
  }, [evaluations, currentUser, selectedStudent, selectedTeacher]);

  // --- Modal de confirmação embutido ---
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEvalId, setSelectedEvalId] = useState<string | null>(null);
  const [selectedEvalStudentName, setSelectedEvalStudentName] = useState<string | null>(null);

  const openConfirmDelete = (evalId: string, studentName?: string) => {
    setSelectedEvalId(evalId);
    setSelectedEvalStudentName(studentName ?? null);
    setIsOpen(true);
  };

  const closeConfirm = () => {
    setIsOpen(false);
    setIsProcessing(false);
    setSelectedEvalId(null);
    setSelectedEvalStudentName(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEvalId) return;
    setIsProcessing(true);
    try {
      await evaluationsAPI.delete(selectedEvalId);
      toast({ title: 'Avaliação excluída', status: 'success', duration: 3000 });
      await refetch();
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Erro ao excluir avaliação',
        description: err?.message || 'Tente novamente',
        status: 'error',
        duration: 5000,
      });
    } finally {
      closeConfirm();
    }
  };

  const loading = loadingEvals || loadingUsers;

  if (loading)
    return (
      <Center py={10}>
        <Spinner />
      </Center>
    );

  if (errorEvals)
    return (
      <Center py={10}>
        <Text color="red.500">Erro ao carregar avaliações</Text>
      </Center>
    );

  return (
    <Center>
      <VStack w="full" spacing={4}>
        {/* Filtros - apenas para admin/professor */}
        {currentUser?.role !== 'aluno' && (
          <HStack spacing={4} w="full">
            <Select
              placeholder={
                currentUser?.role === 'professor' ? 'Alunos do professor' : 'Todos Alunos'
              }
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </Select>

            {currentUser?.role === 'admin' && (
              <Select
                placeholder="Todos Professores"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </Select>
            )}
          </HStack>
        )}

        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Aluno</Th>
              {currentUser?.role === 'admin' && <Th>Professor</Th>}
              <Th>Altura (m)</Th>
              <Th>Peso (kg)</Th>
              <Th>IMC</Th>
              <Th>Classificação</Th>
              <Th>Data</Th>
              {currentUser?.role !== 'aluno' && <Th>Ações</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((ev) => (
              <Tr key={ev.id}>
                <Td>{ev.student.nome}</Td>
                {currentUser?.role === 'admin' && <Td>{ev.teacher.nome}</Td>}
                <Td>{ev.altura.toFixed(2)}</Td>
                <Td>{ev.peso.toFixed(2)}</Td>
                <Td>{ev.imc.toFixed(2)}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      ev.imc < 18.5
                        ? 'yellow'
                        : ev.imc < 25
                          ? 'green'
                          : ev.imc < 30
                            ? 'orange'
                            : ev.imc < 35
                              ? 'red'
                              : ev.imc < 40
                                ? 'red'
                                : 'purple'
                    }
                  >
                    {ev.classificacao}
                  </Badge>
                </Td>
                <Td>{ev.dtInclusao ? new Date(ev.dtInclusao).toLocaleDateString() : '-'}</Td>
                {currentUser?.role !== 'aluno' && (
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Editar avaliação"
                        icon={<FiEdit />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => router.push(`/evaluations/${ev.id}/edit`)}
                      />
                      <IconButton
                        aria-label="Excluir avaliação"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => openConfirmDelete(ev.id, ev.student.nome)}
                      />
                    </HStack>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>

      {/* AlertDialog de confirmação de exclusão */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeConfirm}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar exclusão
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir a avaliação do aluno{' '}
              <strong>{selectedEvalStudentName ?? 'selecionado'}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeConfirm}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirmDelete}
                ml={3}
                isLoading={isProcessing}
              >
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Center>
  );
}
