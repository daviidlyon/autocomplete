import React, { useCallback, useMemo, useRef, useState } from 'react';
import { SuggestionsList } from './components';
import styles from './styles.module.css';
import { useClickOutside } from '../../hooks';
import { Spinner } from '../../assets/icons';

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
    onChange: propsOnChange,
    suggestionsLimit,
    autofocus,
    onItemSelect,
    loading,
  } = props;
  const [value, setValue] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const containerRef = useClickOutside(() => setFocused(false));
  const inputRef = useRef(null);

  const changeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValue(value);
      setActiveIndex(-1);
      propsOnChange(value);
    },
    [propsOnChange]
  );

  const handleSelect = useCallback(
    (value: string) => {
      onItemSelect(value);
      setValue(value);
      setFocused(false);
      if (inputRef.current) {
        (inputRef.current as HTMLInputElement).blur();
      }
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
        event.preventDefault();
        handleSelect(options[activeIndex] || value);
      }

      if (event.key === 'Escape') {
        handleSelect('');
      }
    },
    [options, activeIndex, suggestionsLimit, handleSelect]
  );

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }, [options, value]);

  return (
    <div ref={containerRef} className={styles.autocomplete}>
      <div style={{ display: 'flex' }}>
        <input
          ref={inputRef}
          className={styles.input}
          onChange={changeHandler}
          onKeyDown={handleKeyDown}
          value={value}
          onFocus={() => setFocused(true)}
          autoFocus={autofocus}
          placeholder='Please type something...'
        />
        {loading && <Spinner className={styles.spinner} />}
      </div>
      {focused && (
        <SuggestionsList
          activeIndex={activeIndex}
          loading={loading}
          query={value}
          options={filteredOptions}
          onItemClick={handleSelect}
          onItemHover={(index: number) => setActiveIndex(index)}
          limit={suggestionsLimit}
        />
      )}
    </div>
  );
}
