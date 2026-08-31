import {
  SIGN_IN,
  SIGN_OUT,
  SIGN_UP,
  type AuthPayload,
} from "@/graphql/mutations/auth";
import { apolloClient } from "@/lib/apollo";
import type { Session } from "@/types/session";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

function toSession(payload: AuthPayload): Session {
  return {
    accessToken: payload.token,
    user: payload.user,
  };
}

function getGraphQLErrorMessage(error: unknown, fallback: string): string {
  if (CombinedGraphQLErrors.is(error)) {
    const firstError = error.errors[0];
    const code = firstError?.extensions?.code;

    if (code === "INTERNAL_SERVER_ERROR") {
      return fallback;
    }

    if (firstError?.message?.trim()) {
      return firstError.message.trim();
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
}

export async function signIn(
  email: string,
  password: string,
): Promise<Session> {
  try {
    const { data } = await apolloClient.mutate({
      mutation: SIGN_IN,
      variables: { input: { email, password } },
    });

    if (!data?.signIn) {
      throw new Error("Sign in failed");
    }

    return toSession(data.signIn);
  } catch (error) {
    throw new Error(getGraphQLErrorMessage(error, "Sign in failed"));
  }
}

export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<Session> {
  try {
    const { data } = await apolloClient.mutate({
      mutation: SIGN_UP,
      variables: { input: { name, email, password } },
    });

    if (!data?.signUp) {
      throw new Error("Sign up failed");
    }

    return toSession(data.signUp);
  } catch (error) {
    throw new Error(getGraphQLErrorMessage(error, "Sign up failed"));
  }
}

export async function signOut(): Promise<void> {
  try {
    await apolloClient.mutate({ mutation: SIGN_OUT });
  } catch (error) {
    if (__DEV__) {
      console.warn("Server sign out failed:", error);
    }
  }
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
