import { Button, Drawer, FieldError, Input, Label, TextField, useOverlayState } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useApi } from '@/hooks/useApi';
import { changePassword, updateProfile } from '../services/profile.service';

const initialProfile = {
  email: 'agusalfin1@gmail.com',
  name: 'siaga',
  institution_name: 'SD Negri 1',
  level: 'siaga',
};

type ResetPasswordStep = 'idle' | 'input-password';

const editProfileSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi.'),
  email: z.string().trim().min(1, 'Email wajib diisi.').email('Format email tidak valid'),
});

const resetPasswordSchema = z
  .object({
    oldPassword: z.string().trim().min(1, 'Password lama wajib diisi.'),
    newPassword: z.string().min(6, 'Password baru minimal 8 karakter.'),
    confirmNewPassword: z.string().min(1, 'Konfirmasi password baru wajib diisi.'),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: 'Konfirmasi password baru tidak sama.',
    path: ['confirmNewPassword'],
  });

type EditProfileValues = z.infer<typeof editProfileSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function SettingProfile({ state }: { state: ReturnType<typeof useOverlayState> }) {
  const { api, isSessionReady } = useApi();

  const [profile, setProfile] = useState(initialProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [resetPasswordStep, setResetPasswordStep] = useState<ResetPasswordStep>('idle');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const editProfileForm = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: initialProfile.name,
      email: initialProfile.email,
    },
  });

  const resetPasswordForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const resetAllModes = () => {
    setIsEditingProfile(false);
    setResetPasswordStep('idle');
    setFormSuccessMessage('');
    setFormErrorMessage('');

    editProfileForm.reset({
      email: profile.email,
      name: profile.name,
    });
    resetPasswordForm.reset({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    state.setOpen(isOpen);

    if (!isOpen) {
      resetAllModes();
    }
  };

  const handleOpenEditProfile = () => {
    setFormSuccessMessage('');
    setFormErrorMessage('');
    setResetPasswordStep('idle');
    editProfileForm.reset({
      email: profile.email,
      name: profile.name,
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (values: EditProfileValues) => {
    if (!isSessionReady) {
      setFormErrorMessage('Sesi belum siap. Silakan coba lagi.');

      return;
    }

    setFormSuccessMessage('');
    setFormErrorMessage('');
    setIsSubmittingProfile(true);

    try {
      const response = await updateProfile(api, {
        name: values.name,
        email: values.email,
      });

      setProfile((current) => ({
        ...current,
        name: values.name,
        email: values.email,
      }));
      setFormSuccessMessage(response.data.message || 'Profil berhasil diperbarui.');
      setIsEditingProfile(false);
    } catch (error) {
      const fallbackMessage = 'Gagal memperbarui profil. Silakan coba lagi.';
      const apiError = error as { response?: { data?: { error?: { message?: string } } } };

      setFormErrorMessage(apiError.response?.data?.error?.message || fallbackMessage);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const handleStartResetPassword = () => {
    setFormSuccessMessage('');
    setFormErrorMessage('');
    setIsEditingProfile(false);
    resetPasswordForm.reset({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setResetPasswordStep('input-password');
  };

  const handleSaveNewPassword = async (values: ResetPasswordValues) => {
    if (!isSessionReady) {
      setFormErrorMessage('Sesi belum siap. Silakan coba lagi.');

      return;
    }

    setFormSuccessMessage('');
    setFormErrorMessage('');
    setIsSubmittingPassword(true);

    try {
      const response = await changePassword(api, {
        current_password: values.oldPassword,
        new_password: values.newPassword,
      });

      setFormSuccessMessage(response.data.message || 'Password berhasil diperbarui.');
      setResetPasswordStep('idle');
      resetPasswordForm.reset({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      const fallbackMessage = 'Gagal memperbarui password. Silakan coba lagi.';
      const apiError = error as { response?: { data?: { error?: { message?: string } } } };

      setFormErrorMessage(apiError.response?.data?.error?.message || fallbackMessage);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleCancelEditProfile = () => {
    setFormErrorMessage('');
    editProfileForm.reset({
      email: profile.email,
      name: profile.name,
    });
    setIsEditingProfile(false);
  };

  const handleCancelResetPassword = () => {
    setFormErrorMessage('');
    setResetPasswordStep('idle');
    resetPasswordForm.reset({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  return (
    <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={handleOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="rounded-l-2xl">
          <Drawer.Header>
            <Drawer.Heading className="text-xl font-bold text-primary-900">Profil Anda</Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body className="space-y-5 ">
            {formSuccessMessage && <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">{formSuccessMessage}</p>}
            {formErrorMessage && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{formErrorMessage}</p>}

            {resetPasswordStep === 'idle' && (
              <section className="space-y-4 rounded-2xl border border-primary-100 bg-white/90 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.1 0-7 2.05-7 4.5V20h14v-1.5c0-2.45-2.9-4.5-7-4.5Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Informasi Profil</p>
                    <p className="text-xs text-slate-500">Kelola identitas akun kamu</p>
                  </div>
                </div>

                {!isEditingProfile && (
                  <div className="space-y-3 rounded-xl border border-primary-100 bg-primary-50/80 p-3">
                    <div className="grid grid-cols-[18px_1fr] items-start gap-2">
                      <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 size-4 text-primary-600" aria-hidden="true">
                        <path
                          d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Zm2.28.75 5.72 4.41 5.72-4.41H6.28Zm11.22 1.9-5.04 3.9a.75.75 0 0 1-.92 0L6.5 9.4v7.85c0 .41.34.75.75.75h10.5c.41 0 .75-.34.75-.75V9.4Z"
                          fill="currentColor"
                        />
                      </svg>
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm font-medium text-slate-800">{profile.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-[18px_1fr] items-start gap-2">
                      <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 size-4 text-primary-600" aria-hidden="true">
                        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.1 0-7 2.05-7 4.5V20h14v-1.5c0-2.45-2.9-4.5-7-4.5Z" fill="currentColor" />
                      </svg>
                      <div>
                        <p className="text-xs text-slate-500">Name</p>
                        <p className="text-sm font-medium text-slate-800">{profile.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-[18px_1fr] items-start gap-2">
                      <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 size-4 text-primary-600" aria-hidden="true">
                        <path d="M12 3 4 7v2h16V7l-8-4Zm-6 8v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9H6Zm3 2h6v2H9v-2Z" fill="currentColor" />
                      </svg>
                      <div>
                        <p className="text-xs text-slate-500">Institution</p>
                        <p className="text-sm font-medium text-slate-800">{profile.institution_name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-[18px_1fr] items-start gap-2">
                      <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 size-4 text-primary-600" aria-hidden="true">
                        <path d="M12 3 1.5 9 12 15 22.5 9 12 3Zm-6.75 8.28V15L12 18.75 18.75 15v-3.72L12 15l-6.75-3.72Z" fill="currentColor" />
                      </svg>
                      <div>
                        <p className="text-xs text-slate-500">Level</p>
                        <p className="text-sm font-medium capitalize text-slate-800">{profile.level}</p>
                      </div>
                    </div>
                  </div>
                )}

                {isEditingProfile && (
                  <form id="edit-profile-form" className="flex flex-col gap-4" onSubmit={editProfileForm.handleSubmit(handleSaveProfile)}>
                    <Controller
                      control={editProfileForm.control}
                      name="name"
                      render={({ field, fieldState }) => (
                        <TextField className="w-full" name={field.name} type="text" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                          <Label>Name</Label>
                          <Input className="h-11 border border-gray-400 bg-white" placeholder="Masukkan nama" required value={field.value} variant="secondary" />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </TextField>
                      )}
                    />

                    <Controller
                      control={editProfileForm.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <TextField className="w-full" name={field.name} type="email" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                          <Label>Email</Label>
                          <Input className="h-11 border border-gray-400 bg-white" placeholder="Masukkan email" required value={field.value} variant="secondary" />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </TextField>
                      )}
                    />
                  </form>
                )}

                {!isEditingProfile && (
                  <Button fullWidth className="bg-primary-500 hover:bg-primary-500/90" onPress={handleOpenEditProfile} isDisabled={isSubmittingProfile || isSubmittingPassword}>
                    Edit Profile
                  </Button>
                )}
              </section>
            )}

            {!isEditingProfile && (
              <section className="space-y-4 rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                      <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 1 1 6 0v3H9Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Keamanan Akun</p>
                    <p className="text-xs text-slate-500">Ubah password untuk menjaga akun tetap aman</p>
                  </div>
                </div>

                {resetPasswordStep === 'idle' && (
                  <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                    <p className="text-sm text-slate-700">Reset password dilakukan dalam satu form: isi password lama dan password baru, lalu simpan.</p>
                    <Button className="w-full bg-amber-500 text-white hover:bg-amber-600" onPress={handleStartResetPassword} isDisabled={isSubmittingProfile || isSubmittingPassword}>
                      Reset Password
                    </Button>
                  </div>
                )}

                {resetPasswordStep === 'input-password' && (
                  <form id="reset-password-form" className="flex flex-col gap-4" onSubmit={resetPasswordForm.handleSubmit(handleSaveNewPassword)}>
                    <Controller
                      control={resetPasswordForm.control}
                      name="oldPassword"
                      render={({ field, fieldState }) => (
                        <TextField className="w-full" name={field.name} type="password" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                          <Label>Password Lama</Label>
                          <Input className="h-11 border border-amber-100 bg-white" placeholder="Masukkan password lama" required value={field.value} variant="secondary" />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </TextField>
                      )}
                    />

                    <Controller
                      control={resetPasswordForm.control}
                      name="newPassword"
                      render={({ field, fieldState }) => (
                        <TextField className="w-full" name={field.name} type="password" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                          <Label>Password Baru</Label>
                          <Input className="h-11 border border-amber-100 bg-white" placeholder="Masukkan password baru" required value={field.value} variant="secondary" />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </TextField>
                      )}
                    />

                    <Controller
                      control={resetPasswordForm.control}
                      name="confirmNewPassword"
                      render={({ field, fieldState }) => (
                        <TextField className="w-full" name={field.name} type="password" isInvalid={!!fieldState.error} onChange={field.onChange} onBlur={field.onBlur}>
                          <Label>Konfirmasi Password Baru</Label>
                          <Input className="h-11 border border-amber-100 bg-white" placeholder="Ulangi password baru" required value={field.value} variant="secondary" />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </TextField>
                      )}
                    />
                  </form>
                )}
              </section>
            )}
          </Drawer.Body>
          <Drawer.Footer>
            {isEditingProfile && (
              <>
                <Button variant="secondary" onPress={handleCancelEditProfile}>
                  Batal
                </Button>
                <Button form="edit-profile-form" type="submit" isPending={isSubmittingProfile} isDisabled={isSubmittingProfile || isSubmittingPassword}>
                  Simpan
                </Button>
              </>
            )}

            {resetPasswordStep === 'input-password' && (
              <>
                <Button variant="secondary" onPress={handleCancelResetPassword} isDisabled={isSubmittingPassword}>
                  Batal
                </Button>
                <Button form="reset-password-form" type="submit" isPending={isSubmittingPassword} isDisabled={isSubmittingProfile || isSubmittingPassword}>
                  Simpan Password
                </Button>
              </>
            )}
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
}
