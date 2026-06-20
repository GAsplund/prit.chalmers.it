'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Reserve space so layout doesn't shift before mount
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors ambient-shadow-hover bg-surface-container text-on-surface-variant"
    >
      {isDark ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
    </button>
  );
}
