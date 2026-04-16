import Image from 'next/image';

import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <main className="relative z-10 grid w-full h-screen overflow-hidden lg:grid-cols-2">
      <section className="relative hidden h-screen bg-[#eaf3fb] px-10 py-12 lg:block">
        <Image src="/images/login-illustration.png" alt="Ilustrasi login" fill priority className="object-contain" sizes="(max-width: 1024px) 100vw, 50vw" />
      </section>

      <section className="relative flex h-screen overflow-y-auto items-center bg-white px-6 py-10 sm:px-10 lg:px-14">
        <div className="absolute right-0 top-0 h-20 w-28 bg-[repeating-linear-gradient(45deg,#95bddf,#95bddf_2px,transparent_2px,transparent_12px)] opacity-40" />
        <div className="mx-auto w-full max-w-md">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
