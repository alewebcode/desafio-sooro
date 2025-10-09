import Sidebar from '@/components/SideBar';
import { ChakraProviderWrapper } from '../components/ChakraProviderWrapper';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProviderWrapper>
          <Sidebar />
          {children}
        </ChakraProviderWrapper>
      </body>
    </html>
  );
}
