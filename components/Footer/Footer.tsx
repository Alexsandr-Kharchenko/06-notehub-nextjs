// app/components/Footer/Footer.tsx
import React from 'react';
import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Aleksandr Kharchenko </p>
          <p>
            Contact us:{' '}
            <a href="mailto:ov.kharchenko.office@gmail.com">
              ov.kharchenko.office@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
