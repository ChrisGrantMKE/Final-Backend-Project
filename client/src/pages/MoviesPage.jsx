import { useEffect, useState } from "react";
import { getMovies } from "../api";
import MovieCard from "../components/MovieCard";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [showingOnly, setShowingOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getMovies(showingOnly)
      .then(setMovies)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [showingOnly]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Movies</h2>
          <p>Explore the catalog or filter to films currently in theaters.</p>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showingOnly}
            onChange={(e) => setShowingOnly(e.target.checked)}
          />
          Currently showing only
        </label>
      </div>

      {loading && <p className="status">Loading movies…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.movie_id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
