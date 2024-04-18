import React, { useCallback, useEffect, useState } from 'react';
import { SuggestionsList } from './components';
import styles from './styles.module.css';
import { useClickOutside } from '../../hooks';

type Props = {
  autofocus: boolean;
  onChange: (value: string) => void;
  onItemSelect: (value: string) => void;
  options: string[];
  suggestionsLimit: number;
  loading: boolean;
};

export function Autocomplete(props: Props) {
  const {
    options,
    onChange,
    suggestionsLimit,
    autofocus,
    onItemSelect,
    loading,
  } = props;
  const [value, setValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const containerRef = useClickOutside(() => setFocused(false));

  const changeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValue(value);
      onChange(value);
    },
    [onChange]
  );

  useEffect(() => {
    console.log('[D] activeIndex:', activeIndex);
  }, [activeIndex]);

  const handleSelect = useCallback(
    (value: string) => {
      onItemSelect(value);
      setValue(value);
      setFocused(false);
    },
    [onItemSelect]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const renderedOptions = Math.min(
        options.length - 1,
        suggestionsLimit - 1
      );
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prev) =>
          activeIndex < renderedOptions ? prev + 1 : prev
        );
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prev) => (activeIndex > 0 ? prev - 1 : prev));
      }

      if (event.key === 'Enter') {
        handleSelect(options[activeIndex]);
      }
    },
    [options, activeIndex, suggestionsLimit, handleSelect]
  );

  const onItemHover = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div ref={containerRef} className={styles.autocomplete}>
      <input
        className={styles.input}
        onChange={changeHandler}
        onKeyDown={handleKeyDown}
        value={value}
        onFocus={() => setFocused(true)}
        autoFocus={autofocus}
        placeholder='Please type something...'
      />
      {focused && (
        <SuggestionsList
          activeIndex={activeIndex}
          loading={loading}
          query={value}
          options={options}
          onItemClick={handleSelect}
          onItemHover={onItemHover}
          limit={suggestionsLimit}
        />
      )}
    </div>
  );
}
