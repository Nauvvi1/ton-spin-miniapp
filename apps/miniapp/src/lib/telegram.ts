export interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: {
    user?: TelegramWebAppUser;
  };
  ready: () => void;
  expand: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  enableClosingConfirmation?: () => void;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function getTelegramWebApp(): TelegramWebApp | undefined {
  return window.Telegram?.WebApp;
}

export function initTelegramMiniApp(): void {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return;
  }

  webApp.ready();
  webApp.expand();
  webApp.setHeaderColor?.("#08111f");
  webApp.setBackgroundColor?.("#07111e");
  webApp.enableClosingConfirmation?.();
}

export function getTelegramInitData(): string {
  return getTelegramWebApp()?.initData ?? "";
}

export function getTelegramDisplayName(): string {
  const user = getTelegramWebApp()?.initDataUnsafe?.user;
  return user?.first_name ?? user?.username ?? "Player";
}

export function successHaptic(): void {
  getTelegramWebApp()?.HapticFeedback?.notificationOccurred("success");
}

export function softImpact(): void {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred("soft");
}
