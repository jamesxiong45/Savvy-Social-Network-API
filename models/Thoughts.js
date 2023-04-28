const { Schema, model } = require("mongoose");
const moment = require("moment");
const reactionSchema = require('./Reaction');

const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (dateCreated) =>
        moment(dateCreated).format("MMM DD, YYYY [at] hh:mm a"),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

thoughtsSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});
 
const Thoughts = model("Thought", thoughtsSchema);

module.exports = Thoughts;