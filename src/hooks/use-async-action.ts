import { useCallback, useState } from "react";

/**
 * Hook that wraps async operations with loading state and error handling
 * @returns A tuple of [withSaving, isSaving] where withSaving executes the action with state management
 */
export function useAsyncAction() {
  const [isSaving, setIsSaving] = useState(false);

  const withSaving = useCallback(
    async <T>(
      action: () => Promise<T>,
      options?: {
        onError?: () => void;
        errorMessage?: string;
      }
    ): Promise<T | undefined> => {
      setIsSaving(true);
      try {
        return await action();
      } catch (error) {
        console.error(options?.errorMessage ?? "Action failed:", error);
        options?.onError?.();
        return undefined;
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  return [withSaving, isSaving] as const;
}
