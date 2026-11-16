import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, type Pengguna } from './api';

interface Sesi {
  pengguna: Pengguna | null;
  memuat: boolean;
  setPengguna: (p: Pengguna | null) => void;
  keluar: () => Promise<void>;
}

const Ctx = createContext<Sesi>(null!);
export const useSesi = () => useContext(Ctx);

export function SesiProvider({ children }: { children: ReactNode }) {
  const [pengguna, setPengguna] = useState<Pengguna | null>(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    api<{ pengguna: Pengguna }>('/auth/me')
      .then((d) => setPengguna(d.pengguna))
      .catch(() => setPengguna(null))
      .finally(() => setMemuat(false));
  }, []);

  const keluar = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    setPengguna(null);
  }, []);

  return <Ctx.Provider value={{ pengguna, memuat, setPengguna, keluar }}>{children}</Ctx.Provider>;
}
