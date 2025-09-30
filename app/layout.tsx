import './globals.css';
import '../app/page.module.css';
import Header from '@/app/components/Header/Header';
import Footer from '@/app/components/Footer/Footer';
import TanStackProvider from '@/app/components/TanStackProvider/TanStackProvider';

export const metadata = {
  title: 'NoteHub',
  description: 'Manage your notes efficiently',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          <main>{children}</main>
          <Footer />

          <div id="modal-root"></div>
        </TanStackProvider>
      </body>
    </html>
  );
}
