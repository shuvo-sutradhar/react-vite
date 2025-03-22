import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDV_API_KEY

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
}

const App = () => {

  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearch, setDebounceSearch] = useState('');

  useDebounce(() => setDebounceSearch(search), 500, [search]);

  const fetchMovie = async (query = '') => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      
      const endpoint = query 
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

      

    } catch (error) {
      setErrorMessage('Error fetching movies. Please try again later');
    } finally {
      setIsLoading(false);
    }

  }

  const loadTrendingMovies = async() => {
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch(error){
      console.log(`Error fetching trending movie: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovie(search);
  }, [debounceSearch]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);


  return (
    <main>

      <div className="patterns" />

      <div className="wrapper"> 

        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span>  You'll enjoy without the hassle
          </h1> 
        <Search search={search} setSearch={setSearch} />
        </header>

        { trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              { trendingMovies.map((movie, index) => (
                 <li key={movie.$id}>
                  <p>{ index + 1 }</p>
                  <img src={movie.poster_url} alt={movie.title} />
                 </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          { isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-white">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </ul>
          )}

        
        </section>

      </div>
    </main>
  );

}

export default App;