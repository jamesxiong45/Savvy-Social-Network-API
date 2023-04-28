const router = require("express").Router();

const {
  getThoughts,
  getThoughtsById,
  createThoughts,
  updateThoughts,
  deleteThoughts,
  addReaction,
  deleteReaction,
} = require("../../controllers/thoughtController");

router.route("/")
  .get(getThoughts)
  .post(createThoughts);

router.route("/:thoughtId")
  .get(getThoughtsById)
  .put(updateThoughts)
  .delete(deleteThoughts);

router.route("/:thoughtId/reactions")
  .post(addReaction)
  .delete(deleteReaction);

module.exports = router;