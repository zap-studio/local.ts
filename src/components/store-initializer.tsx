import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

import { isTauri } from "@/lib/platform";
import { useSettings } from "@/stores/settings";
import { useTheme } from "@/stores/theme";

interface StoreInitializerProps {
  children: React.ReactNode;
}

export function StoreInitializer({ children }: StoreInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initializeSettings = useSettings((state) => state.initialize);
  const initializeTheme = useTheme((state) => state.initialize);
  const isNativeApp = isTauri();

  useEffect(() => {
    if (!isNativeApp) {
      return;
    }

    const init = async () => {
      try {
        await initializeSettings();
        initializeTheme();

        setIsInitialized(true);

        // Close splash screen and show main window
        await invoke("close_splashscreen");
      } catch (err) {
        console.error("Failed to initialize stores:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));

        // Still close splash screen on error to show error UI
        await invoke("close_splashscreen").catch(console.error);
      }
    };

    init();
  }, [initializeSettings, initializeTheme, isNativeApp]);

  const handleRetry = async () => {
    setError(null);
    setIsInitialized(false);

    try {
      await initializeSettings();
      initializeTheme();
      setIsInitialized(true);
    } catch (err) {
      console.error("Retry failed:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    }
  };

  if (error) {
    return <InitializationError error={error} onRetry={handleRetry} />;
  }

  if (!isNativeApp) {
    return <NativeOnlyScreen />;
  }

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}

interface InitializationErrorProps {
  error: Error;
  onRetry: () => void;
}

function InitializationError({ error, onRetry }: InitializationErrorProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-6">
      <div className="text-center">
        <h1 className="font-bold text-2xl text-destructive">
          Initialization Error
        </h1>
        <p className="mt-2 text-muted-foreground">
          Failed to load application settings
        </p>
        <p className="mt-1 text-muted-foreground text-sm">{error.message}</p>
      </div>
      <button
        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
        onClick={onRetry}
        type="button"
      >
        Retry
      </button>
    </div>
  );
}

function NativeOnlyScreen() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <h1 className="font-bold text-2xl">Native App Required</h1>
        <p className="max-w-md text-muted-foreground">
          This application is designed to run as a native desktop or mobile app.
          It cannot run in a web browser.
        </p>
        <p className="text-muted-foreground text-sm">
          Please download and install the native application for your platform.
        </p>
      </div>
    </div>
  );
}
