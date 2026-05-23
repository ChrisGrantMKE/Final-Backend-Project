import { useState } from "react";

export default function MoviePoster({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`movie-poster movie-poster--fallback ${className}`} aria-label={alt}>
        <span className="movie-poster__icon">🎬</span>
        <span className="movie-poster__title">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`movie-poster ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
