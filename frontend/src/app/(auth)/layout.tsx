import { ChakraProviderWrapper } from '@/components/ChakraProviderWrapper';
import { AuthProvider } from '@/context/AuthContext';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProviderWrapper>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </ChakraProviderWrapper>
      </body>
    </html>
  );
}
