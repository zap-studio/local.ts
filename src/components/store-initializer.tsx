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

  // Check if running in browser (not Tauri)
  if (!isTauri()) {
    return <NativeOnlyScreen />;
  }

  useEffect(() => {
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
  }, [initializeSettings, initializeTheme]);

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
        <h1 className="text-2xl font-bold text-destructive">
          Initialization Error
        </h1>
        <p className="mt-2 text-muted-foreground">
          Failed to load application settings
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Retry
      </button>
    </div>
  );
}

function NativeOnlyScreen() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="text-center flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold">Native App Required</h1>
        <p className="max-w-md text-muted-foreground">
          This application is designed to run as a native desktop or mobile app.
          It cannot run in a web browser.
        </p>
        <p className="text-sm text-muted-foreground">
          Please download and install the native application for your platform.
        </p>
      </div>
    </div>
  );
}
