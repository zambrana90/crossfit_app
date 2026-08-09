import { Topbar } from '@/features/topbar';

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <Topbar />
      <main className="mx-auto w-full max-w-[1024px] flex-1 px-4 pb-10 pt-20">
        {children}
      </main>
    </div>
  );
}
