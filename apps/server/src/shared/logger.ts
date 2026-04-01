export const logger = {
  info(message: string, payload?: unknown): void {
    console.log(`[server] ${message}`, payload ?? "");
  },
  error(message: string, payload?: unknown): void {
    console.error(`[server] ${message}`, payload ?? "");
  }
};
