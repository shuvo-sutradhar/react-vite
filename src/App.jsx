import React, { useEffect, useState } from "react";
import Search from "./components/Search";

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovie = async () => {
    try {
      
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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

    } catch (error) {
      setErrorMessage('Error fetching movies. Please try again later');
    }
  }

  useEffect(() => {
    fetchMovie();
  }, []);


  return (
    <main>

      <div className="patterns" />

      <header>
        <img src="./hero-img.png" alt="Hero Banner" />
        <h1>
          Find <span className="text-gradient">Movies</span>  You'll enjoy without the hassle
        </h1> 
       <Search search={search} setSearch={setSearch} />
      </header>

      <section className="all-movies">
        <h2>All Movies</h2>

        { errorMessage && <p className="text-red-500">{ errorMessage }</p>  }

      </section>
    </main>
  );

}

export default App;