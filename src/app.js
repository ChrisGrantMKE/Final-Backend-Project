if (process.env.USER) require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();

const moviesRouter = require("./movies/movies.router");
const theatersRouter = require("./theaters/theaters.router");
const reviewsRouter = require("./reviews/reviews.router");

const { FRONTEND_URL } = process.env;

const corsOptions = {
  // When FRONTEND_URL is set, only that origin is allowed in production.
  // When unset, reflect the request origin so local dev frontends on any port work.
  origin: FRONTEND_URL || true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

module.exports = app;
