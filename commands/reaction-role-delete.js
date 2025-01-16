const Eris = require("eris");
const { MongoClient } = require('mongodb');
const getOptionValue = require("../utils/eris/getOptionValue.js");
const Constants = Eris.Constants;

module.exports = {
    name: "reaction-role-delete",
    description: "Removes reaction role functionality from a message.",
    defaultMemberPermissions: 268435456,
    options: [
        {
            "name": "messageid",
            "description": "ID of the message to check for reaction.",
            "type": Constants.ApplicationCommandOptionTypes.STRING,
            "required": true,
        },
    ],
    async execute(interaction, client, mongoClient) {
        const message = await client.getMessage(
            interaction.channel.id,
            getOptionValue(interaction.data.options, "messageid")
        );

        const database = mongoClient.db("RunyBot");
        const messageCollection = database.collection("Messages");
        const result = await messageCollection.deleteMany({
            channelID: interaction.channel.id,
            messageID: getOptionValue(interaction.data.options, "messageid")
        });

        console.log("Deleted " + result.deletedCount + " reaction listeners.");

        interaction.createFollowup(`I've successfully deleted reaction listeners on the message ${getOptionValue(interaction.data.options, "messageid")}!`);
    }
};
