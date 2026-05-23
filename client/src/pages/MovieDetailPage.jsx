import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getMovie,
  getMovieReviews,
  getMovieTheaters,
} from "../api";
import ReviewCard from "../components/ReviewCard";
import MoviePoster from "../components/MoviePoster";

export default function MovieDetailPage() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      getMovie(movieId),
      getMovieTheaters(movieId),
      getMovieReviews(movieId),
    ])
      .then(([movieData, theaterData, reviewData]) => {
        setMovie(movieData);
        setTheaters(theaterData);
        setReviews(reviewData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [movieId]);

  function handleReviewChange(reviewId, updated) {
    if (updated === null) {
      setReviews((current) => current.filter((r) => r.review_id !== reviewId));
      return;
    }
    setReviews((current) =>
      current.map((r) => (r.review_id === reviewId ? updated : r))
    );
  }

  if (loading) return <p className="status">Loading movie…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return null;

  return (
    <section className="page">
      <Link to="/" className="back-link">
        ← Back to movies
      </Link>

      <div className="movie-detail">
        <MoviePoster src={movie.image_url} alt={movie.title} className="movie-detail__poster" />
        <div>
          <h2>{movie.title}</h2>
          <p className="movie-detail__meta">
            {movie.rating} · {movie.runtime_in_minutes} minutes
          </p>
          <p>{movie.description}</p>
        </div>
      </div>

      <div className="detail-grid">
        <section className="panel">
          <h3>Theaters</h3>
          {theaters.length === 0 ? (
            <p className="muted">Not playing in any theaters.</p>
          ) : (
            <ul className="theater-list">
              {theaters.map((theater) => (
                <li key={theater.theater_id}>
                  <strong>{theater.name}</strong>
                  <span>
                    {theater.city}, {theater.state}
                  </span>
                  <span className={`badge ${theater.is_showing ? "badge--on" : "badge--off"}`}>
                    {theater.is_showing ? "Now showing" : "Not showing"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h3>Reviews</h3>
          {reviews.length === 0 ? (
            <p className="muted">No reviews yet.</p>
          ) : (
            <div className="review-list">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.review_id}
                  review={review}
                  onChange={(updated) => handleReviewChange(review.review_id, updated)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
