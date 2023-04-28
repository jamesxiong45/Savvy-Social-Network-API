// npm i --save-dev @faker-js/faker
const { faker } = require("@faker-js/faker");
const db = require("../config/connection");
const { Thoughts, User } = require("../models");

db.once("open", async () => {
  await Thoughts.deleteMany({});
  await User.deleteMany({});


  const userData = [];

  for (let i = 0; i < 5; i += 1) {
    const username = faker.internet.userName();
    const email = faker.internet.email(username);

    userData.push({ username, email });
  }

  const createdUsers = await User.insertMany(userData);

  
  for (let i = 0; i < 10; i += 1) {
    const randomUserIndex = Math.floor(Math.random() * createdUsers.length);
    const { _id: userId } = createdUsers[randomUserIndex];

    let friendId = userId;

    while (friendId === userId) {
      const randomUserIndex = Math.floor(Math.random() * createdUsers.length);
      friendId = createdUsers[randomUserIndex];
    }

    await User.updateOne({ _id: userId }, { $addToSet: { friends: friendId } });
  }

  let createdThoughtss = [];
  for (let i = 0; i < 10; i += 1) {
    const thoughtText = faker.lorem.words(Math.round(Math.random() * 20) + 1);

    const randomUserIndex = Math.floor(Math.random() * createdUsers.length);
    const { username, _id: userId } = createdUsers[randomUserIndex];

    const createdThoughts = await Thoughts.create({ thoughtText, username });

    const updatedUser = await User.updateOne(
      { _id: userId },
      { $push: { Thoughtss: createdThoughts._id } }
    );

    createdThoughtss.push(createdThoughts);
  }

  for (let i = 0; i < 10; i += 1) {
    const reactionBody = faker.lorem.words(Math.round(Math.random() * 20) + 1);

    const randomUserIndex = Math.floor(Math.random() * createdUsers.length);
    const { username } = createdUsers[randomUserIndex];

    const randomThoughtsIndex = Math.floor(
      Math.random() * createdThoughtss.length
    );
    const { _id: ThoughtsId } = createdThoughtss[randomThoughtsIndex];

    await Thoughts.updateOne(
      { _id: ThoughtsId },
      { $push: { reactions: { reactionBody, username } } },
      { runValidators: true }
    );
  }

  console.log("all done!");
  process.exit(0);
});
