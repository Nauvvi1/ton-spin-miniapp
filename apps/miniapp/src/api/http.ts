import { getTelegramInitData } from "../lib/telegram";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

interface RequestOptions extends RequestInit {
  path: string;
}

export async function apiRequest<T>({ path, headers, ...rest }: RequestOptions): Promise<T> {
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Content-Type", "application/json");

  const initData = getTelegramInitData();
  if (initData) {
    finalHeaders.set("x-telegram-init-data", initData);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders
  });

  if (!response.ok) {
    const fallback = "Request failed";
    try {
      const payload = (await response.json()) as { message?: string };
      throw new Error(payload.message ?? fallback);
    } catch (error) {
      throw error instanceof Error ? error : new Error(fallback);
    }
  }

  return (await response.json()) as T;
}
