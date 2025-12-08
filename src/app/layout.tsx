// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { SupabaseProvider } from '@/lib/supabase-context'; // ✅ Import it

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider> {/* ✅ Wrap everything */}
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}