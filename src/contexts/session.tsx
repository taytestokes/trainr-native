import { getSession, setSession as persistSession } from "@/lib/storage";
import type { Session } from "@/types/session";
import {
  createContext,
  use,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

type SessionContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate session from storage on mount
  useEffect(() => {
    getSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setIsLoading(false));
  }, []);

  // Sign in
  const signIn = async (session: Session) => {
    await persistSession(session);
    setSession(session);
  };

  // Sign out
  const signOut = async () => {
    await persistSession(null);
    setSession(null);
  };

  // Provider value
  return (
    <SessionContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = use(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
}
