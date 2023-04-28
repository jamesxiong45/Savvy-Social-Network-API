const { User } = require("../models");

const handleError = (res, err) => {
  console.error(err);
  res.status(500).json(err);
};

module.exports = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      handleError(res, err);
    }
  },


  async createUsers(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (err) {
      handleError(res, err);
    }
  },

  async getUsersById(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.id }).select('-__v');
      if (!user) {
        return res.status(404).json({ message: "No user with this ID" });
      }
      res.json(user);
    } catch (err) {
      handleError(res, err);
    }
  },


  async updateUsers(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "No user with this ID!" });
      }
      res.json({ message: "User information has been updated." });
    } catch (err) {
      handleError(res, err);
    }
  },


  async deleteUsers(req, res) {
    try {
      const deletedUser = await User.findOneAndRemove({ _id: req.params.id });
      if (!deletedUser) {
        return res.status(404).json({ message: "No user with this ID." });
      }
      res.json({ message: "User has been deleted" });
    } catch (err) {
      handleError(res, err);
    }
  },

  async addFriend(req, res) {
    console.log("A friend is addind.");
    console.log(req.body);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "No user found with this ID!" });
      }
      res.json({ message: "A new friend has been added." });
    } catch (err) {
      handleError(res, err);
    }
  },


  async deleteFriend(req, res) {
    console.log("A friend are removing!");
    console.log(req.body);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "No friend found with this ID." });
      }
      res.json({ message: "A friend has been removd." });
    } catch (err) {
      handleError(res, err);
    }
  },
};