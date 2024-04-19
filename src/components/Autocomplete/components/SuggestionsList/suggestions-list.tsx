import { useEffect, useMemo, useRef } from 'react';
import styles from './styles.module.css';
import { Suggestion } from '../Suggestion';
import { UserMessaging } from './user-messaging';
import { scrollIntoViewIfNeeded } from '../../../../utils/scroll-into-view';
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

  const activeRef = useRef(null);
  useEffect(() => {
    if (activeRef.current) {
      scrollIntoViewIfNeeded(activeRef.current);
    }
  }, [activeIndex]);

  const displayedOptions = useMemo(() => {
    return options.slice(0, limit);
  }, [options, limit]);

  if (query && !loading && !options.length) {
    return <UserMessaging content='No results...' />;
  }

  return (
    <div className={styles.suggestionsContainer}>
      <ul className={styles.suggestionsList}>
        {displayedOptions.map((option, index) => (
          <li
            key={`${option}-${index}`}
            onMouseEnter={() => onItemHover(index)}
            ref={activeIndex === index ? activeRef : null}
          >
            <Suggestion
              onClick={onItemClick}
              content={option}
              query={query}
              active={activeIndex === index}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
