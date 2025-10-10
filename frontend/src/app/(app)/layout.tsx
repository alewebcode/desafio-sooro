import Sidebar from '@/components/SideBar';
import { ChakraProviderWrapper } from '../../components/ChakraProviderWrapper';

import { AuthProvider } from '@/context/AuthContext';
import { Box, Flex } from '@chakra-ui/react';
import { ProtectedRoute } from '@/components/ProtectedRoutes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProviderWrapper>
          <AuthProvider>
            <Flex h="100vh">
              {/* Sidebar fixa */}
              <Box w="250px">
                <Sidebar />
              </Box>

              {/* Conteúdo principal */}
              <Box flex="1" p={4} overflowX="auto">
                <ProtectedRoute>{children}</ProtectedRoute>
              </Box>
            </Flex>
          </AuthProvider>
        </ChakraProviderWrapper>
      </body>
    </html>
  );
}
