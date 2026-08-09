import type { Metadata } from 'next';
import LoginPage from '@/_pages/login';

export const metadata: Metadata = {
  title: 'CrossFit WOD – Acceso',
};

// All fonts are loaded globally in the root layout (app/layout.tsx).
export default function Page() {
  return <LoginPage />;
}
