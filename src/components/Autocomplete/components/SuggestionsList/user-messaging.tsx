import styles from './styles.module.css';

type Props = {
  content: string;
};

export function UserMessaging({ content }: Props) {
  return (
    <div className={styles.suggestionsContainer}>
      <div className={styles.messagingContainer}>{content}</div>
    </div>
  );
}
