const Eris = require("eris");
const { MongoClient } = require('mongodb');
const getOptionValue = require("../utils/eris/getOptionValue.js");
const Constants = Eris.Constants;

module.exports = {
  name: "join-role-purge",
  description: "Deletes ALL join roles currently active in the server.",
  defaultMemberPermissions: 268435456,
  async execute(interaction, client, mongoClient) {
    const database = mongoClient.db("RunyBot");
    const messageCollection = database.collection("JoinRoles");

    const result = await messageCollection.deleteMany({
      guildID: interaction.guildID,
    });

    console.log(`Join roles purged in server ${interaction.guildID}!`);
    interaction.createFollowup("I've successfully purged all join roles from this server!");
  }
};
