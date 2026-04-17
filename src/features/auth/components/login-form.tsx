'use client';

import { Button, Checkbox, Description, FieldError, Input, Label, Spinner, TextField, toast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginValues = z.infer<typeof loginSchema>;

async function createLoginPromise(values: LoginValues) {
  const result = await signIn('credentials', {
    email: values.email,
    password: values.password,
    redirect: false,
  });

  if (result?.error) {
    throw new Error('Email atau password tidak valid');
  }

  return result;
}

export function LoginForm() {
  const router = useRouter();
  const { status } = useSession();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    const loginPromise = createLoginPromise(values);

    toast.promise(loginPromise, {
      loading: 'Memproses login...',
      success: 'Login berhasil',
      error: (error) => error.message || 'Login gagal, silakan coba lagi',
    });

    await loginPromise;
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner aria-label="Memuat sesi" />
      </div>
    );
  }

  return (
    <div className="w-full text-[#4c6178]">
      <p className="mb-4 text-center text-xl font-bold text-primary-600">Garuda</p>
      <h1 className="text-center text-[34px] font-bold leading-tight text-[#204865] sm:text-[40px]">Hai, selamat datang kembali</h1>

      <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField name={field.name} type="email" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
              <Label>Email</Label>
              <Input placeholder="john@example.com" className="h-11 border border-gray-400" value={field.value} />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField name={field.name} type="password" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
              <Label>Password</Label>
              <Input placeholder="Enter your password" className="h-11 border border-gray-400" value={field.value} />
              <Description>Password minimal 6 karakter</Description>
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />

        <div className="flex justify-between">
          <Checkbox id="basic-terms">
            <Checkbox.Control className="size-5 border">
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <Label htmlFor="basic-terms">Ingat saya</Label>
            </Checkbox.Content>
          </Checkbox>
          <Link href="#" className="font-semibold text-blue-500 text-sm hover:text-blue-500/90">
            Lupa kata sandi?
          </Link>
        </div>

        <Button type="submit" fullWidth isDisabled={isSubmitting} size="lg" className="bg-primary-500 hover:bg-primary-500/90">
          {isSubmitting ? <Spinner color="current" size="sm" /> : 'Submit'}
        </Button>

        <p className="mt-2 text-center text-sm text-gray-500">
          Belum memiliki akun?{' '}
          <Link href="#" className="font-semibold text-blue-500 hover:text-blue-500/90">
            Daftar Disini
          </Link>
        </p>
      </form>
    </div>
  );
}
