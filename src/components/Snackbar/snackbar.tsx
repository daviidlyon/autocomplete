import { useEffect, useState } from 'react';

type Props = {
  message: string;
  duration: number;
};

export function SnackBar({ message, duration }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!visible || !message) {
    return null;
  }

  return <div className='snackbar show'>{message}</div>;
}
