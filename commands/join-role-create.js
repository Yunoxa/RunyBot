const Eris = require("eris");
const { MongoClient } = require('mongodb');
const getOptionValue = require("../utils/eris/getOptionValue.js");
const Constants = Eris.Constants;

module.exports = {
  name: "join-role-create",
  description: "Provides a specified role to new users.",
  defaultMemberPermissions: 268435456,
  options: [
    {
      "name": "role",
      "description": "The role to give to users.",
      "type": Constants.ApplicationCommandOptionTypes.ROLE,
      "required": true,
    },
  ],
  async execute(interaction, client, mongoClient) {
    const database = mongoClient.db("RunyBot");
    const collection = database.collection("JoinRoles");

    const getDocs = await database.collection("Messages").find({
      guildID: interaction.guildID,
      role: getOptionValue(interaction.data.options, "role")
    });

    if ((await collection.countDocuments({
      guildID: interaction.guildID,
      role: getOptionValue(interaction.data.options, "role")
    })) === 0) {
      const result = await collection.insertOne({
        guildID: interaction.guildID,
        role: getOptionValue(interaction.data.options, "role")
      });

      interaction.createFollowup(`I've successfully enabled this role for auto-provision to new users!`);
    } else {
      interaction.createFollowup("This role is already being added upon users joining!");
    }
  }
}
