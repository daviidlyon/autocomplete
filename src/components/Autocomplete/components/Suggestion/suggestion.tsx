import { Highlighted } from '../../..';
import styles from './styles.module.css';
import { SearchIcon } from '../../../../assets/icons';

type Props = {
  active: boolean;
  content: string;
  query: string;
  onClick: (value: string) => void;
};

export function Suggestion(props: Props) {
  const { active, content, query, onClick } = props;

  return (
    <div
      className={`${styles.suggestion} ${
        active ? styles.activeSuggestion : ''
      }`}
      onClick={() => onClick(content)}
    >
      <SearchIcon />
      <Highlighted text={content} highlight={query} />
    </div>
  );
}
