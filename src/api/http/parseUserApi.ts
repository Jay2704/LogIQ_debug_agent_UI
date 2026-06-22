import type { CreateUserInput, User, UserRole } from "@/types";

const USER_ROLES: UserRole[] = [
  "developer",
  "support_engineer",
  "tester",
  "sre",
  "viewer",
];

function pickString(
  obj: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function pickStringOrNumber(
  obj: Record<string, unknown>,
  keys: string[]
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return undefined;
}

function normalizeRole(raw: string | undefined): UserRole {
  if (!raw) return "viewer";
  const r = raw.toLowerCase().replace(/\s+/g, "_");
  if (USER_ROLES.includes(r as UserRole)) return r as UserRole;
  return "viewer";
}

/**
 * Unwraps `{ user: {...} }`, `{ data: {...} }`, or returns the row as-is.
 */
function unwrapUserRowJson(json: unknown): unknown {
  if (!json || typeof json !== "object" || Array.isArray(json)) return json;
  const o = json as Record<string, unknown>;
  const user = o.user;
  if (user && typeof user === "object" && !Array.isArray(user)) return user;
  const data = o.data;
  if (data && typeof data === "object" && !Array.isArray(data)) return data;
  return json;
}

/**
 * Parses JSON detail from login error responses (`{ detail: { code, message } }`).
 */
export function parseLoginErrorDetail(text: string): {
  code?: string;
  message?: string;
} {
  if (!text.trim()) return {};
  try {
    const j = JSON.parse(text) as unknown;
    if (!j || typeof j !== "object") return {};
    const o = j as Record<string, unknown>;
    const detail = o.detail;
    if (detail && typeof detail === "object" && !Array.isArray(detail)) {
      const d = detail as Record<string, unknown>;
      return {
        code: typeof d.code === "string" ? d.code : undefined,
        message: typeof d.message === "string" ? d.message : undefined,
      };
    }
    if (typeof o.code === "string") {
      return {
        code: o.code,
        message: typeof o.message === "string" ? o.message : undefined,
      };
    }
  } catch {
    /* non-JSON */
  }
  return {};
}

/**
 * Successful login: flat `LoginResponse` with user fields plus `access_token` at the top level.
 */
export function parseLoginResponse(json: unknown): { user: User; accessToken: string } {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new Error("[LogIQ API] Invalid login JSON");
  }
  const o = json as Record<string, unknown>;
  const accessToken =
    pickString(o, ["access_token", "accessToken", "token"]) ?? "";
  if (!accessToken) {
    throw new Error("[LogIQ API] Login response missing access_token");
  }
  return { user: parseUserJson(json), accessToken };
}

export function parseUserJson(json: unknown): User {
  const row = unwrapUserRowJson(json);
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    throw new Error("[LogIQ API] Invalid user JSON");
  }
  const o = row as Record<string, unknown>;
  const userId =
    pickStringOrNumber(o, ["user_id", "userId", "id"]) ?? "";
  const createdAt =
    pickString(o, ["created_at", "createdAt"]) ?? new Date().toISOString();
  let firstName = pickString(o, ["first_name", "firstName"]) ?? "";
  let lastName = pickString(o, ["last_name", "lastName"]) ?? "";
  const legacyName = pickString(o, ["name", "full_name", "fullName"]);
  if ((!firstName && !lastName) && legacyName) {
    const t = legacyName.trim();
    const i = t.indexOf(" ");
    if (i < 0) {
      firstName = t;
      lastName = "";
    } else {
      firstName = t.slice(0, i).trim();
      lastName = t.slice(i + 1).trim();
    }
  }
  const email = pickString(o, ["email"]) ?? "";
  const team = pickString(o, ["team"]) ?? "";
  const role = normalizeRole(pickString(o, ["role"]));
  if (!userId) {
    throw new Error("[LogIQ API] User JSON missing user id");
  }
  return {
    userId,
    firstName,
    lastName,
    email,
    role,
    team,
    createdAt,
  };
}

/** Parses a list response: raw array, `{ items: [...] }`, or `{ users: [...] }`. */
export function parseUserListJson(json: unknown): User[] {
  if (Array.isArray(json)) {
    return json.map((row) => parseUserJson(row));
  }
  if (json && typeof json === "object" && !Array.isArray(json)) {
    const o = json as Record<string, unknown>;
    const items = o.items ?? o.users ?? o.data;
    if (Array.isArray(items)) {
      return items.map((row) => parseUserJson(row));
    }
  }
  throw new Error("[LogIQ API] Invalid user list JSON");
}

/**
 * Email lookup may return a single user object, `{ items: [...] }`, or a bare array.
 */
export function parseUserLookupJson(json: unknown): User | undefined {
  if (json == null) return undefined;
  if (Array.isArray(json)) {
    if (json.length === 0) return undefined;
    return parseUserJson(json[0]);
  }
  if (typeof json === "object") {
    const o = json as Record<string, unknown>;
    const items = o.items ?? o.users;
    if (Array.isArray(items)) {
      if (items.length === 0) return undefined;
      return parseUserJson(items[0]);
    }
  }
  return parseUserJson(json);
}

export function serializeCreateUserBody(input: CreateUserInput): Record<string, string> {
  return {
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    role: input.role,
    team: input.team,
    password: input.password,
  };
}
