const router = require("express").Router();

const {
  createUsers,
  getAllUsers,
  getUsersById,
  updateUsers,
  deleteUsers,
  addFriend,
  deleteFriend,
} = require("../../controllers/usersController");

router.route("/")
  .get(getAllUsers)
  .post(createUsers);

router.route("/:usersId")
  .get(getUsersById)
  .put(updateUsers)
  .delete(deleteUsers);

router.route("/:usersId/friends/:friendId")
  .post(addFriend)
  .delete(deleteFriend);

module.exports = router;