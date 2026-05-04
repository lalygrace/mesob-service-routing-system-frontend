"use client";

import * as React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};

type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

function getFullscreenElement() {
  if (typeof document === "undefined") return null;
  const fullscreenDocument = document as FullscreenDocument;
  return (
    document.fullscreenElement ??
    fullscreenDocument.webkitFullscreenElement ??
    null
  );
}

export function useFullscreenStatus() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(getFullscreenElement()));
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  return isFullscreen;
}

export function FullscreenToggle({ className }: { className?: string }) {
  const isFullscreen = useFullscreenStatus();

  async function toggleFullscreen() {
    const fullscreenDocument = document as FullscreenDocument;
    const root = document.documentElement as FullscreenElement;

    if (
      !root.requestFullscreen &&
      !root.webkitRequestFullscreen &&
      !document.exitFullscreen &&
      !fullscreenDocument.webkitExitFullscreen
    ) {
      return;
    }

    try {
      if (getFullscreenElement()) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else await fullscreenDocument.webkitExitFullscreen?.();
      } else if (root.requestFullscreen) {
        await root.requestFullscreen();
      } else {
        await root.webkitRequestFullscreen?.();
      }
    } catch {
      // Fullscreen can be blocked by kiosk/browser policies. Keep the UI stable.
    }
  }

  const label = isFullscreen ? "Exit fullscreen" : "Enter fullscreen";
  const Icon = isFullscreen ? Minimize2 : Maximize2;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("h-9 w-9 rounded-full", className)}
      onClick={toggleFullscreen}
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
