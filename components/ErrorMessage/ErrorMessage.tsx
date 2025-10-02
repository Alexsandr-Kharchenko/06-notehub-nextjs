import styles from './ErrorMessage.module.css';

export default function ErrorMessage() {
  return (
    <div className={styles.error}>Something went wrong. Try again later.</div>
  );
}
