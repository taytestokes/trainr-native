import type { Session } from "@/types/session";

function createMockSession(email: string): Session {
  return {
    accessToken: `mock-token-${Date.now()}`,
    user: {
      id: "mock-user-id",
      email,
    },
  };
}

export async function signIn(
  email: string,
  _password: string,
): Promise<Session> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!email.trim()) {
    throw new Error("Email is required");
  }

  return createMockSession(email.trim());
}

export async function signUp(
  email: string,
  _password: string,
): Promise<Session> {
  // TODO: Implement actual sign up logic
  await new Promise((resolve) => setTimeout(resolve, 400));

  return createMockSession(email.trim());
}

export async function requestPasswordReset(email: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!email.trim()) {
    throw new Error("Email is required");
  }

  // TODO: Replace with GraphQL mutation. Always behave the same for unknown emails.
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!token.trim()) {
    throw new Error("This reset link is invalid or expired");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  // TODO: Replace with GraphQL mutation
}
