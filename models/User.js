const { Schema, model } = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      unique: true, 
      required: true, 
      trimmed: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/ 
    },
    thoughts: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Thought' 
    }],
    friends: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);


userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
