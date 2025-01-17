const Eris = require("eris");
const { MongoClient } = require('mongodb');
const getOptionValue = require("../utils/eris/getOptionValue.js");
const Constants = Eris.Constants;

module.exports = {
  name: "list-join-roles",
  description: "Provides a list of all roles currently assigned upon joining the server.",
  defaultMemberPermissions: 268435456,
  async execute(interaction, client, mongoClient) {
    const database = mongoClient.db("RunyBot");
    const messageCollection = database.collection("JoinRoles");

    const getJoinRoles = await messageCollection.find({
      guildID: interaction.guildID
    });

    const joinRoles = [];
    await getJoinRoles.forEach((doc) => {
      console.log(doc)
      joinRoles.push(`Role ID: ${doc.role}`)
    });

    console.log(joinRoles)

    interaction.createFollowup({
      embeds: [{
        title: "Join Roles",
        description: joinRoles.join("\r\n"),
        color: 16711680,
        footer: {
          text: "List of role ID's assigned to users upon joining this server."
        }
      }]
    });
  }
};
