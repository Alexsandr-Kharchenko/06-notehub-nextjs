'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.getElementById('modal-root') || document.body;
    setModalRoot(root);

    // Забороняємо прокрутку сторінки
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);

    return () => {
      // Відновлюємо прокрутку при закритті модалки
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  if (!modalRoot) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>{children}</div>
    </div>,
    modalRoot
  );
}
