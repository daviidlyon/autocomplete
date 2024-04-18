import { useMemo } from 'react';
import styles from './styles.module.css';
import { Suggestion } from '../Suggestion';
import { UserMessaging } from './user-messaging';
type Props = {
  activeIndex: number;
  options?: string[];
  limit?: number;
  query: string;
  onItemClick: (value: string) => void;
  onItemHover: (index: number) => void;
  loading?: boolean;
};

export function SuggestionsList(props: Props) {
  const {
    activeIndex,
    options = [],
    limit = undefined,
    query,
    onItemClick,
    loading,
    onItemHover,
  } = props;

  const displayedOptions = useMemo(() => {
    return options.slice(0, limit);
  }, [options, limit]);

  if (loading) {
    return <UserMessaging content='Loading...' />;
  }

  if (query && !options.length) {
    return <UserMessaging content='No results...' />;
  }

  return (
    <div className={styles.suggestionsContainer}>
      <ul className={styles.suggestionsList}>
        {displayedOptions.map((option, index) => (
          <li
            key={`${option}-${index}`}
            onMouseEnter={() => onItemHover(index)}
          >
            <Suggestion
              onClick={onItemClick}
              content={option}
              query={query}
              active={activeIndex == index}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
