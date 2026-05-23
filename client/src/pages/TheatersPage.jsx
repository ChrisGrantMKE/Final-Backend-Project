import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTheaters } from "../api";

export default function TheatersPage() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTheaters()
      .then(setTheaters)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status">Loading theaters…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h2>Theaters</h2>
          <p>See which films are playing at each location.</p>
        </div>
      </div>

      <div className="theater-grid">
        {theaters.map((theater) => (
          <article key={theater.theater_id} className="theater-card">
            <h3>{theater.name}</h3>
            <p className="theater-card__address">
              {theater.address_line_1}
              {theater.address_line_2 && `, ${theater.address_line_2}`}
              <br />
              {theater.city}, {theater.state} {theater.zip}
            </p>
            <h4>{theater.movies?.length || 0} films</h4>
            <ul className="theater-card__movies">
              {(theater.movies || []).map((movie) => (
                <li key={`${theater.theater_id}-${movie.movie_id}`}>
                  <Link to={`/movies/${movie.movie_id}`}>{movie.title}</Link>
                  <span className={`badge ${movie.is_showing ? "badge--on" : "badge--off"}`}>
                    {movie.is_showing ? "Showing" : "Not showing"}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
