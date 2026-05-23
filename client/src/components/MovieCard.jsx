import { Link } from "react-router-dom";
import MoviePoster from "./MoviePoster";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.movie_id}`} className="movie-card">
      <MoviePoster src={movie.image_url} alt={movie.title} />
      <div className="movie-card__body">
        <h3>{movie.title}</h3>
        <p className="movie-card__meta">
          {movie.rating} · {movie.runtime_in_minutes} min
        </p>
        <p className="movie-card__description">{movie.description}</p>
      </div>
    </Link>
  );
}
