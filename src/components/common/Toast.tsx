import { useEffect } from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-[10px] border border-success/20 bg-success-bg px-4 py-3 shadow-lg">
      <Check size={15} className="text-success" />
      <span className="text-[13px] font-medium text-success">{message}</span>
    </div>
  );
}