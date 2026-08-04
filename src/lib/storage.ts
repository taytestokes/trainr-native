import type { Session } from "@/types/session";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const SESSION_KEY = "trainr_session";

function parseSession(raw: string): Session | null {
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  let raw: string | null;

  if (Platform.OS === "web") {
    try {
      raw = localStorage.getItem(SESSION_KEY);
    } catch (error) {
      console.error("Local storage is unavailable:", error);
      return null;
    }
  } else {
    raw = await SecureStore.getItemAsync(SESSION_KEY);
  }

  if (!raw) {
    return null;
  }

  return parseSession(raw);
}

export async function setSession(session: Session | null): Promise<void> {
  if (Platform.OS === "web") {
    try {
      if (session === null) {
        localStorage.removeItem(SESSION_KEY);
      } else {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    } catch (error) {
      console.error("Local storage is unavailable:", error);
    }
    return;
  }

  if (session === null) {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } else {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  }
}
