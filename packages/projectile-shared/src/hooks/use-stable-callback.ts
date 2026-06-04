import { useRef } from "react";
import { useLatest } from "./use-latest";

export function useStableCallback<TArgs extends unknown[], TResult>(
    callback: (...args: TArgs) => TResult,
) {
    const callbackRef = useLatest(callback);
    const stableCallbackRef = useRef<((...args: TArgs) => TResult) | null>(null);

    if (!stableCallbackRef.current) {
        stableCallbackRef.current = (...args: TArgs) => callbackRef.current(...args);
    }

    return stableCallbackRef.current!;
}
