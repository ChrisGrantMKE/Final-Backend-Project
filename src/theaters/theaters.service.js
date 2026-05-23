const db = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  movie_created_at: ["movies", null, "created_at"],
  movie_updated_at: ["movies", null, "updated_at"],
  is_showing: ["movies", null, "is_showing"],
  theater_id: ["movies", null, "theater_id"],
});

async function list() {
  return db("theaters as th")
    .join("movies_theaters as mt", "th.theater_id", "mt.theater_id")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select(
      "th.theater_id",
      "th.name",
      "th.address_line_1",
      "th.address_line_2",
      "th.city",
      "th.state",
      "th.zip",
      "th.created_at",
      "th.updated_at",
      "m.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url",
      "m.created_at as movie_created_at",
      "m.updated_at as movie_updated_at",
      "mt.is_showing"
    )
    .then(reduceMovies);
}

async function listByMovie(movie_id) {
  return db("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where({ "mt.movie_id": movie_id });
}

module.exports = {
  list,
  listByMovie,
};
