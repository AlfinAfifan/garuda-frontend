'use client';

import { useEffect, useState } from 'react';

import { GarudaContent } from '@/features/garuda/components/GarudaContent';

export default function GarudaPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <GarudaContent />;
}
