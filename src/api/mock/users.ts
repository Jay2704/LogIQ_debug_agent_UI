import type { AuthService, UsersService } from "@/api/contracts";
import type { CreateUserInput, LoginInput, User } from "@/types";
import { setAccessToken } from "@/auth/tokenStorage";

/** In-memory users for mock mode and dev without a backend. */
const store = new Map<string, User>();
const byEmail = new Map<string, string>();
/** Demo-only password store for mock login — not a security model. */
const passwordByEmail = new Map<string, string>();

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export const mockUsersService: UsersService = {
  async create(input: CreateUserInput): Promise<User> {
    const emailKey = input.email.trim().toLowerCase();
    const existingId = byEmail.get(emailKey);
    if (existingId && store.has(existingId)) {
      throw new Error(
        "[LogIQ API] POST /api/v1/users 409 Conflict: Email already registered"
      );
    }
    const user: User = {
      userId: makeId(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
      role: input.role,
      team: input.team.trim(),
      createdAt: new Date().toISOString(),
    };
    store.set(user.userId, user);
    byEmail.set(emailKey, user.userId);
    passwordByEmail.set(emailKey, input.password);
    return user;
  },

  async getUserById(userId: string): Promise<User | undefined> {
    return store.get(userId);
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    const id = byEmail.get(email.trim().toLowerCase());
    if (!id) return undefined;
    return store.get(id);
  },

  async listUsers(): Promise<User[]> {
    return [...store.values()];
  },
};

export const mockAuthService: AuthService = {
  async login(input: LoginInput) {
    const emailKey = input.email.trim().toLowerCase();
    const user = await mockUsersService.getUserByEmail(input.email);
    if (!user) {
      throw new Error("[LogIQ API] LOGIN_STATUS 404");
    }
    const stored = passwordByEmail.get(emailKey);
    if (!stored || stored !== input.password) {
      throw new Error("[LogIQ API] LOGIN_STATUS 401");
    }
    const accessToken = `mock.${user.userId}.${Date.now()}`;
    setAccessToken(accessToken);
    return { user, accessToken };
  },

  async verifyEmail(_token: string): Promise<void> {
    void _token;
    return;
  },

  async forgotPassword(_email: string): Promise<void> {
    void _email;
    return;
  },

  async resetPassword(_token: string, password: string): Promise<void> {
    void _token;
    if (!password) {
      throw new Error("[LogIQ API] POST /api/v1/auth/reset-password 400");
    }
    return;
  },

  async resendVerificationEmail(_email: string): Promise<void> {
    void _email;
    return;
  },
};
