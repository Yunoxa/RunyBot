const Eris = require("eris");
const { MongoClient } = require('mongodb');
const getOptionValue = require("../utils/eris/getOptionValue.js");
const Constants = Eris.Constants;

module.exports = {
  name: "list-reaction-roles",
  description: "Provides a list of all reaction role listeners currently active within the current channel.",
  defaultMemberPermissions: 268435456,
  async execute(interaction, client, mongoClient) {
    const database = mongoClient.db("RunyBot");
    const collection = database.collection("Messages");

    const getListeners = await collection.find({
      channelID: interaction.channel.id
    });

    const listenerData = [];
    await getListeners.forEach((doc) => {
      listenerData.push(`Message ID: ${doc.messageID}`);
    });

    interaction.createFollowup({
      embeds: [{
        title: "Active Reaction Role Listeners",
        description: listenerData.join("\r\n"),
        color: 16711680,
        footer: {
          text: "Role reaction listeners active in the current channel."
        }
      }]
    });
  }
};
