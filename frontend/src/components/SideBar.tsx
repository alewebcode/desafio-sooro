'use client';

import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Link as ChakraLink,
  useColorModeValue,
  Divider,
  Flex,
  Button,
} from '@chakra-ui/react';

import { IconType } from 'react-icons';
import { FiHome, FiUsers, FiBarChart2, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type NavItem = {
  label: string;
  href: string;
  icon?: IconType;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: FiHome },
  { label: 'Usuários', href: '/users', icon: FiUsers },
  { label: 'Avaliações', href: '/evaluations', icon: FiBarChart2 },
];

function NavLink({ item, active }: { item: NavItem; active?: boolean }) {
  const bg = useColorModeValue('gray.100', 'gray.700');
  const color = useColorModeValue('gray.700', 'gray.100');

  return (
    <ChakraLink
      as={Link}
      href={item.href}
      style={{ textDecoration: 'none', width: '100%' }}
      _hover={{ textDecoration: 'none' }}
    >
      <HStack
        spacing={3}
        align="center"
        p={3}
        borderRadius="md"
        role="group"
        _groupHover={{ bg }}
        bg={active ? bg : 'transparent'}
      >
        {item.icon && <Box as={item.icon} fontSize="lg" color={color} />}
        <Text fontWeight={active ? 'semibold' : 'medium'} color={color}>
          {item.label}
        </Text>
      </HStack>
    </ChakraLink>
  );
}

export function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname() ?? '/';
  const { user: currentUser, logout } = useAuth();
  if (!currentUser) return null;

  const filteredNavItems = navItems.filter((item) => {
    if (!currentUser) return false; // se não tiver usuário, não mostra nada
    if (currentUser.role === 'aluno' && item.label === 'Usuários') {
      return false;
    }
    return true;
  });

  return (
    <Box
      as="nav"
      aria-label="Sidebar"
      w={{ base: 'full', md: 64 }}
      pos="fixed"
      h="full"
      overflowY="auto"
      bg={useColorModeValue('white', 'gray.800')}
      borderRightWidth={{ base: 0, md: 1 }}
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      p={4}
    >
      <VStack align="stretch" spacing={4}>
        <Box px={2} py={3}>
          <Text fontSize="lg" fontWeight="bold">
            Meu App
          </Text>
          <Text fontSize="sm" color="gray.500">
            Painel administrativo
          </Text>
        </Box>

        <Divider />

        <VStack align="stretch" spacing={1}>
          {filteredNavItems.map((item) => (
            <Box key={item.href} onClick={onClose}>
              <NavLink item={item} active={pathname === item.href} />
            </Box>
          ))}
        </VStack>

        <Flex mt="auto" direction="column" gap={2}>
          <Divider />
          <Button
            leftIcon={<FiLogOut />}
            variant="ghost"
            justifyContent="flex-start"
            onClick={() => {
              if (confirm('Deseja sair do sistema?')) {
                logout();
              }
            }}
          >
            Logout
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}

export default function Sidebar() {
  return (
    <>
      <Box display={{ base: 'none', md: 'block' }}>
        <SidebarContent />
      </Box>
    </>
  );
}
