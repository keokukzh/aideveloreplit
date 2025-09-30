type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    posthog?: { capture: (event: string, properties?: AnalyticsPayload) => void };
  }
}

export function initAnalytics(): void {
  // Lightweight no-deps init. If PostHog snippet is present, we will use it.
  // Otherwise we just no-op with console fallback in development.
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const host = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || "https://eu.posthog.com";
  if (!key) {
    if (import.meta.env.DEV) console.info("[analytics] PostHog key not set; using console fallback");
    return;
  }
  // Optionally you could inject PostHog snippet here; we keep it lightweight.
  // Users can add the official SDK later without changing the track() API.
  if (import.meta.env.DEV) console.info(`[analytics] PostHog configured (host=${host})`);
}

export function track(eventName: string, properties?: AnalyticsPayload): void {
  try {
    if (window.posthog && typeof window.posthog.capture === "function") {
      window.posthog.capture(eventName, properties);
      return;
    }
    if (import.meta.env.DEV) console.debug(`[track] ${eventName}`, properties || {});
  } catch {
    // ignore analytics errors
  }
}

export function trackPageView(pageName: string): void {
  track("page_view", { page: pageName });
}

