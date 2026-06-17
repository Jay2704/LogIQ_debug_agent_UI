/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import { DEMO_MODE } from "@/lib/demoMode";
import { DEMO_USER } from "@/lib/demoUser";
import {
  clearCurrentUser as clearPersistedSession,
  getCurrentUser,
  setCurrentUser as persistCurrentUser,
  subscribeCurrentUserChanged,
  type CurrentUserSnapshot,
} from "./currentUserSession";

export interface CurrentUserContextValue {
  /** Full domain user from storage, or null. */
  user: User | null;
  /** Binds UI to a user row; persists to localStorage. */
  setCurrentUser: (user: User | CurrentUserSnapshot) => void;
  /** Clears prototype session (not a secure server logout). */
  clearCurrentUser: () => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() =>
    DEMO_MODE ? DEMO_USER : getCurrentUser()
  );

  const syncFromStorage = useCallback(() => {
    if (DEMO_MODE) {
      setUserState(DEMO_USER);
      return;
    }
    setUserState(getCurrentUser());
  }, []);

  useEffect(() => {
    if (DEMO_MODE) return;
    return subscribeCurrentUserChanged(syncFromStorage);
  }, [syncFromStorage]);

  const setUser = useCallback((next: User | CurrentUserSnapshot) => {
    if (DEMO_MODE) return;
    persistCurrentUser(next);
  }, []);

  const clear = useCallback(() => {
    if (DEMO_MODE) return;
    clearPersistedSession();
  }, []);

  const value = useMemo<CurrentUserContextValue>(
    () => ({
      user: DEMO_MODE ? DEMO_USER : user,
      setCurrentUser: setUser,
      clearCurrentUser: clear,
    }),
    [user, setUser, clear]
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserContextValue {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) {
    throw new Error("useCurrentUser must be used within CurrentUserProvider");
  }
  return ctx;
}
