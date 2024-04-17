"use client";
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state: any) => state.user.isLoggedIn);

  if (isLoggedIn) {
    router.push('/dashboard');
    return null;
  }

  return <>{children}</>;
};

export default GuestRoute;