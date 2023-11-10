export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let lastInvokeTime = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: any[]) => {
    const now = Date.now();
    const timeSinceLastInvoke = now - lastInvokeTime;

    const invoke = () => {
      lastInvokeTime = Date.now();
      func(...args);
    };

    if (timeSinceLastInvoke >= delay) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      invoke();
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        invoke();
      }, delay - timeSinceLastInvoke);
    }
  }) as T;
};
