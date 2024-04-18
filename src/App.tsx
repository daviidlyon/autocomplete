import { useRef, useState } from 'react';
import './App.css';
import { Autocomplete } from './components';
import { debounce } from './utils/debounce';
import { SnackBar } from './components/Snackbar';
import { getMovies } from './api/get-movies';

const SUGGESTIONS_LIMIT = 5;
const SEARCH_DEBOUNCE_TIME = 300;

function App() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const lastSearchTimestamp = useRef<number>(0);

  const fetchAPI = async (query: string) => {
    const timestamp = Date.now();
    lastSearchTimestamp.current = timestamp;
    const { movies, error } = await getMovies(query);
    // Prevents race condition with past responses
    if (timestamp < lastSearchTimestamp.current) {
      return;
    }
    setItems(movies);
    setError(error);
    setLoading(false);
  };

  const debouncedFetchAPI = debounce(fetchAPI, SEARCH_DEBOUNCE_TIME);

  const handleChange = (value: string) => {
    setLoading(true);
    setError('');
    debouncedFetchAPI(value);
  };

  const clickHandler = (value: string) => {
    console.log('[D] selected: ', value);
  };

  return (
    <div className='main-container'>
      <h2> Welcome to Movie Search! </h2>
      <Autocomplete
        loading={loading}
        onChange={handleChange}
        options={items}
        suggestionsLimit={SUGGESTIONS_LIMIT}
        onItemSelect={clickHandler}
        autofocus
      />
      <SnackBar message={error} duration={5000} />
    </div>
  );
}

export default App;
