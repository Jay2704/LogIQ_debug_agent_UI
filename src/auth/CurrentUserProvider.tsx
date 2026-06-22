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
  /** Binds UI to a user row; persists user and optional JWT to localStorage. */
  setCurrentUser: (user: User | CurrentUserSnapshot, accessToken?: string) => void;
  /** Clears session user and JWT. */
  clearCurrentUser: () => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => getCurrentUser());

  const syncFromStorage = useCallback(() => {
    setUserState(getCurrentUser());
  }, []);

  useEffect(() => subscribeCurrentUserChanged(syncFromStorage), [syncFromStorage]);

  const setUser = useCallback(
    (next: User | CurrentUserSnapshot, accessToken?: string) => {
      persistCurrentUser(next, accessToken);
    },
    []
  );

  const clear = useCallback(() => {
    clearPersistedSession();
  }, []);

  const value = useMemo<CurrentUserContextValue>(
    () => ({
      user,
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
