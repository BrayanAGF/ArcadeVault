"use client";

// Sesión falsa del MVP: solo guarda un nombre en localStorage. No hay autenticación real.
import { createContext, useContext, useSyncExternalStore } from "react";

export type User = { name: string };

const STORAGE_KEY = "av_user";

type Session = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

// --- Store externo sobre localStorage ---

// Copia en memoria: es la fuente de verdad si localStorage está bloqueado.
let memoryRaw: string | null = null;
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return memoryRaw;
  }
}

function writeRaw(raw: string | null) {
  memoryRaw = raw;
  try {
    if (raw === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Sin localStorage la sesión vive solo en memoria.
  }
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  // Mantiene la sesión sincronizada entre pestañas.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) notify();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", onStorage);
  };
}

// getSnapshot debe devolver la misma referencia mientras el valor no cambie.
let cachedRaw: string | null = null;
let cachedUser: User | null = null;

function getSnapshot(): User | null {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = JSON.parse(raw ?? "null") as User | null;
      cachedUser = parsed?.name ? parsed : null;
    } catch {
      cachedUser = null; // JSON corrupto: se sigue como invitado.
    }
  }
  return cachedUser;
}

// En el servidor (y en la hidratación) siempre se es invitado, para que el HTML coincida.
function getServerSnapshot(): User | null {
  return null;
}

// --- API pública ---

const SessionContext = createContext<Session | null>(null);

const signIn = (user: User) => writeRaw(JSON.stringify(user));
const signOut = () => writeRaw(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <SessionContext value={{ user, signIn, signOut }}>{children}</SessionContext>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession debe usarse dentro de <SessionProvider>");
  return session;
}
