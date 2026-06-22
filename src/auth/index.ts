/**
 * Prototype current user / session layer — **not** production authentication.
 * Imperative helpers (`getCurrentUser`, `setCurrentUser`, `clearCurrentUser`) and
 * `CurrentUserProvider` share the same localStorage backing store.
 */
export {
  CurrentUserProvider,
  useCurrentUser,
  type CurrentUserContextValue,
} from "./CurrentUserProvider";
export {
  CURRENT_USER_CHANGED_EVENT,
  clearCurrentUser,
  getCurrentUser,
  normalizeToUser,
  setCurrentUser,
  subscribeCurrentUserChanged,
  toCurrentUserSnapshot,
  type CurrentUserSnapshot,
} from "./currentUserSession";
export {
  PROTOTYPE_SESSION_STORAGE_KEY,
  type PrototypeSessionPayloadV1,
  loadPersistedUser,
  persistUser,
  clearPersistedUser,
} from "./prototypeSessionStorage";
export {
  ACCESS_TOKEN_STORAGE_KEY,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./tokenStorage";
