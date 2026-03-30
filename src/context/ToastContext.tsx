import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2 } from 'lucide-react';

type ToastContextValue = {
  show: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    window.setTimeout(() => setMessage(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {message ? (
        <div
          className="fixed bottom-6 right-6 z-[300] flex max-w-md items-start gap-3 rounded-2xl border border-white/[0.1] bg-[#0c0e14]/95 px-4 py-3 text-sm text-slate-100 shadow-2xl shadow-teal-500/10 ring-1 ring-teal-500/15 backdrop-blur-xl"
          role="status"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
          </span>
          <span className="pt-1 leading-snug">{message}</span>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast ToastProvider içinde kullanılmalıdır.');
  }
  return ctx;
}
