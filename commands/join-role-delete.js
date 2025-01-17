const Eris = require("eris");
const { MongoClient } = require('mongodb');
const getOptionValue = require("../utils/eris/getOptionValue.js");
const Constants = Eris.Constants;

module.exports = {
  name: "join-role-delete",
  description: "Disables a role from being auto-provided to new users.",
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
    const messageCollection = database.collection("JoinRoles");

    const result = await messageCollection.deleteOne({
      guildID: interaction.guildID,
      role: getOptionValue(interaction.data.options, "role")
    });

    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
      interaction.createFollowup(`I've successfully disabled this role for auto-provision to new users!`);
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
      interaction.createFollowup(`Hmm, this role doesn't seem to be enabled in the first place.`);
    }
  }
};
