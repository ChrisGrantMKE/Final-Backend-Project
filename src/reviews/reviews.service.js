const db = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const tableName = "reviews";

const addCritic = mapProperties({
  critic_critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  critic_created_at: "critic.created_at",
  critic_updated_at: "critic.updated_at",
});

async function destroy(review_id) {
  return db(tableName).where({ review_id }).del();
}

async function list(movie_id) {
  return db(`${tableName} as r`)
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at",
      "r.updated_at",
      "r.critic_id",
      "r.movie_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
      "c.critic_id as critic_critic_id",
      "c.created_at as critic_created_at",
      "c.updated_at as critic_updated_at"
    )
    .where({ "r.movie_id": movie_id })
    .then((rows) => rows.map(addCritic));
}

async function read(review_id) {
  return db(tableName).where({ review_id }).first();
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  const { review_id, content, score } = review;

  await db(tableName).where({ review_id }).update({ content, score });

  return read(review_id).then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
