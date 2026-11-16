import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Kategori } from '../api';

export function Logo({ terang = false }: { terang?: boolean }) {
  return (
    <span className={`logo${terang ? ' logo--terang' : ''}`}>
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill={terang ? '#fff' : '#2747D8'} />
        <path d="M9 8l7 9v7M23 8l-7 9" fill="none" stroke={terang ? '#2747D8' : '#fff'} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="23" cy="8" r="2.6" fill="#FFC857" />
      </svg>
      YourWay
    </span>
  );
}

const IKON_KATEGORI: Record<Kategori, string> = { tinggi: '▲', sedang: '●', rendah: '▼' };

export function LencanaKategori({ k }: { k: Kategori }) {
  return (
    <span className={`lencana lencana--${k}`}>
      <span aria-hidden="true">{IKON_KATEGORI[k]}</span> {k[0].toUpperCase() + k.slice(1)}
    </span>
  );
}

/* ---------- Toast ---------- */
type Toast = { id: number; pesan: string; jenis: 'ok' | 'galat' };
const ToastCtx = createContext<(pesan: string, jenis?: Toast['jenis']) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [daftar, setDaftar] = useState<Toast[]>([]);
  const tampil = useCallback((pesan: string, jenis: Toast['jenis'] = 'ok') => {
    const id = Date.now() + Math.random();
    setDaftar((d) => [...d, { id, pesan, jenis }]);
    setTimeout(() => setDaftar((d) => d.filter((t) => t.id !== id)), 4500);
  }, []);
  // Area toast memakai popover agar tampil di atas modal (<dialog>) yang sedang terbuka.
  const area = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = area.current as (HTMLDivElement & { showPopover?: () => void; hidePopover?: () => void }) | null;
    if (!el?.showPopover) return;
    try {
      if (el.matches(':popover-open')) el.hidePopover!();
      if (daftar.length) el.showPopover();
    } catch { /* popover tidak didukung */ }
  }, [daftar]);
  return (
    <ToastCtx.Provider value={tampil}>
      {children}
      <div className="toast-area" role="status" aria-live="polite" ref={area} {...{ popover: 'manual' }}>
        {daftar.map((t) => (
          <div key={t.id} className={`toast toast--${t.jenis}`}>{t.pesan}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- Modal ---------- */
export function Modal({ judul, tutup, children }: { judul: string; tutup: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current!;
    if (!d.open) d.showModal();
    return () => d.close();
  }, []);
  return (
    <dialog ref={ref} className="modal" onCancel={(e) => { e.preventDefault(); tutup(); }} onClick={(e) => { if (e.target === ref.current) tutup(); }}>
      <div className="modal__isi">
        <header className="modal__kepala">
          <h2>{judul}</h2>
          <button type="button" className="tombol-ikon" onClick={tutup} aria-label="Tutup">✕</button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

export function Memuat({ teks = 'Memuat…' }: { teks?: string }) {
  return <p className="memuat" role="status"><span className="spinner" aria-hidden="true" /> {teks}</p>;
}

export function Galat({ pesan }: { pesan: string }) {
  return <p className="galat" role="alert">{pesan}</p>;
}
