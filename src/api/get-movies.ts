import { API_KEY } from '../config';
import { Movie } from '../types';

const API_URL = 'https://api.themoviedb.org/3/search/movie';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + API_KEY,
  },
};

type MoviesResponse = {
  movies: string[];
  error: string;
};

export async function getMovies(query: string): Promise<MoviesResponse> {
  const url = API_URL + `?query=${query.toLowerCase()}`;
  let movies: string[] = [];
  let error = '';
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    /* UNCOMMENT IF YOU WANT TO SIMULATE NETWORK DELAYS */
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms));
    // await delay(2000);

    /* UNCOMMENT IF YOU WANT TO MIMIC ERROR FAILURES */
    // throw Error('Error!')

    if (!response.ok) {
      throw Error('Error in the API call!');
    }

    movies = formatMoviesArray(data.results, query);
  } catch (err) {
    error = (err as Error).message || 'Something went wrong';
  }
  return { movies, error };
}

function formatMoviesArray(data: Array<Movie>, query: string): string[] {
  return data.reduce((acc: string[], curr: Movie) => {
    return curr.title.toLowerCase().includes(query.toLowerCase())
      ? [...acc, curr.title]
      : acc;
  }, [] as string[]);
}
