import { escapeRegExp } from '../../utils/escape-regex';

type Props = {
  text: string;
  highlight: string;
};

export function Highlighted(props: Props) {
  const { text, highlight } = props;
  const safeHighlight = escapeRegExp(highlight);
  const regex = new RegExp(`(${safeHighlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={`${i}-${part}`}
          style={regex.test(part) ? { fontWeight: 'bold' } : {}}
        >
          {part}
        </span>
      ))}
    </span>
  );
}
