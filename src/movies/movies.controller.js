const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const { movieId } = request.params;
  const movie = await service.read(movieId);

  if (movie) {
    response.locals.movie = movie;
    return next();
  }

  return next({ status: 404, message: "Movie cannot be found." });
}

async function read(request, response) {
  response.json({ data: response.locals.movie });
}

async function list(request, response) {
  const { is_showing } = request.query;
  const data = await service.list(is_showing === "true");
  response.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
};
