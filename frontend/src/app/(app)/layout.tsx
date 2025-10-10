import Sidebar from '@/components/SideBar';
import { ChakraProviderWrapper } from '../../components/ChakraProviderWrapper';

import { AuthProvider } from '@/context/AuthContext';

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
            <Sidebar />
            {children}
          </AuthProvider>
        </ChakraProviderWrapper>
      </body>
    </html>
  );
}
