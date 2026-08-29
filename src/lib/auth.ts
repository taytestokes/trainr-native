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
