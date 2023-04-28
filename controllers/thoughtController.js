const { Thoughts, User } = require("../models");

const handleError = (res, err) => {
  console.error(err);
  res.status(500).json(err);
};

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thoughts.find();
      res.json(thoughts);
    } catch (err) {
      handleError(res, err);
    }
  },

  async getThoughtsById(req, res) {
    try {
      const thought = await Thoughts.findOne({ _id: req.params.thoughtId }).select("-__v");
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json(thought);
    } catch (err) {
      handleError(res, err);
    }
  },

  async createThoughts(req, res) {
    try {
      const dbThoughtData = await Thoughts.create(req.body);
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thoughts!" });
      }
      const user = await User.findOneAndUpdate(
        req.body.userId,
        { $addToSet: { thoughts: dbThoughtData._id } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "error. No thoughts!" });
      }
      res.json(dbThoughtData);
    } catch (err) {
      handleError(res, err);
    }
  },

  async deleteThoughts(req, res) {
    try {
      const thought = await Thoughts.findOneAndRemove({ _id: req.params.thoughtId });
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID." });
      }
      const user = await User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "Thought deleted, but no user found" });
      }
      res.json({ message: "Thought deleted." });
    } catch (err) {
      handleError(res, err);
    }
  },

  async updateThoughts(req, res) {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "No thought with this ID!" });
      }
      res.json(thought);
    } catch (err) {
      handleError(res, err);
    }
  },

  async addReaction(req, res) {
    try {
      const thought = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "error with thought!" });
      }
      res.json(thought);
    } catch (err) {
      handleError(res, err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const reaction = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!reaction) {
        return res.status(404).json({ message: "No reaction found" });
      }
      res.json({ message: "Reaction deleted" });
    } catch (err) {
      handleError(res, err);
    }
  }
};
