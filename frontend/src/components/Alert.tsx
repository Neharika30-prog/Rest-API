import { useEffect } from 'react';

type Props = {
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  autoCloseMs?: number | null;
};

export default function Alert({ type = 'info', message, onClose, autoCloseMs = 4000 }: Props) {
  useEffect(() => {
    if (!autoCloseMs) return;
    const t = setTimeout(() => {
      onClose && onClose();
    }, autoCloseMs);
    return () => clearTimeout(t);
  }, [autoCloseMs, onClose]);

  return (
    <div className={`alert alert-${type}`} role="alert">
      <div className="alert-message">{message}</div>
      {onClose && (
        <button className="alert-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}
