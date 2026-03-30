import { useCallback, useRef, useState } from "react";

/** Mock-only delay before showing static results — swap for real API later */
export function useSimulatedUtilityRun(delayMs = 420) {
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback(
    (after: () => void) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setRunning(true);
      timerRef.current = setTimeout(() => {
        after();
        setRunning(false);
        timerRef.current = null;
      }, delayMs);
    },
    [delayMs]
  );

  return { running, run };
}
