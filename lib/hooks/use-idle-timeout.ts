"use client";

/**
 * useIdleTimeout
 *
 * Resets the citizen flow after a configurable period of inactivity.
 * Timeout value is read from GET /api/public/kiosk-config
 * (SystemConfig key: kiosk_idle_timeout_seconds, default 120 s).
 *
 * Listens to: mousemove, mousedown, keydown, touchstart, scroll, pointerdown.
 * Any of these events resets the inactivity timer.
 *
 * Per the proposal: "kiosk_idle_timeout_seconds" controls this value.
 * The hook is disabled on the language and review steps (no timeout while
 * a citizen is actively reading their result).
 */

import * as React from "react";
import { apiData } from "@/lib/api/client";

const DEFAULT_TIMEOUT_MS = 120_000; // 2 minutes
const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "pointerdown",
] as const;

type KioskConfig = {
  kioskIdleTimeoutSeconds: number;
  defaultLanguage: string;
  maxClarificationRounds: number;
};

async function fetchKioskConfig(): Promise<KioskConfig> {
  return apiData<KioskConfig>("/api/public/kiosk-config");
}

export function useIdleTimeout({
  enabled,
  onTimeout,
}: {
  /** Disable the timer on steps where the citizen is actively reading */
  enabled: boolean;
  onTimeout: () => void;
}) {
  const [timeoutMs, setTimeoutMs] = React.useState(DEFAULT_TIMEOUT_MS);
  const timerRef = React.useRef<number | null>(null);
  const onTimeoutRef = React.useRef(onTimeout);

  // Keep the callback ref current without re-registering listeners
  React.useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Fetch the configured timeout once on mount
  React.useEffect(() => {
    fetchKioskConfig()
      .then((cfg) => {
        const ms = cfg.kioskIdleTimeoutSeconds * 1000;
        if (ms > 0) setTimeoutMs(ms);
      })
      .catch(() => {
        // Silently fall back to default — never break the kiosk
      });
  }, []);

  React.useEffect(() => {
    if (!enabled) {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      return;
    }

    function resetTimer() {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        onTimeoutRef.current();
      }, timeoutMs);
    }

    // Start the timer immediately
    resetTimer();

    // Reset on any user activity
    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [enabled, timeoutMs]);
}
