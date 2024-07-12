import { ReactNode, useEffect, useState } from 'react';

interface NotificationProps {
  type: 'error' | 'success' | 'warning';
  children: ReactNode;
  className?: string;
  duration?: number; // duration in milliseconds
}

export function Notification({ type, children, className = "", duration = 3000 }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const baseStyle = "p-4 rounded-md text-white";
  const typeStyles = {
    error: "bg-red-500",
    success: "bg-green-500",
    warning: "bg-yellow-500",
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]} ${className}`}>
      {children}
    </div>
  );
}

