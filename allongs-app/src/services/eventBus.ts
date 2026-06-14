// Simple event bus para comunicação entre api.ts e AuthContext sem import circular
type Listener = () => void;

const listeners: Record<string, Listener[]> = {};

export const eventBus = {
  emit(event: string) {
    listeners[event]?.forEach((fn) => fn());
  },
  on(event: string, fn: Listener) {
    listeners[event] = [...(listeners[event] || []), fn];
  },
  off(event: string, fn: Listener) {
    listeners[event] = (listeners[event] || []).filter((f) => f !== fn);
  },
};
