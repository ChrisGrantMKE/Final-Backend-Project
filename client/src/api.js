const API_URL = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error || "Request failed");
  }

  return body.data;
}

export function getMovies(isShowingOnly = false) {
  const query = isShowingOnly ? "?is_showing=true" : "";
  return request(`/movies${query}`);
}

export function getMovie(movieId) {
  return request(`/movies/${movieId}`);
}

export function getMovieTheaters(movieId) {
  return request(`/movies/${movieId}/theaters`);
}

export function getMovieReviews(movieId) {
  return request(`/movies/${movieId}/reviews`);
}

export function getTheaters() {
  return request("/theaters");
}

export function updateReview(reviewId, data) {
  return request(`/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify({ data }),
  });
}

export function deleteReview(reviewId) {
  return request(`/reviews/${reviewId}`, { method: "DELETE" });
}
