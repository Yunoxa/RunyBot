const Eris = require("eris");
const { MongoClient } = require('mongodb');
const getOptionValue = require("../utils/eris/getOptionValue.js");
const Constants = Eris.Constants;

module.exports = {
    name: "reaction-role",
    description: "Flags a message to be checked for a reaction and signals to add a specified role based on it.",
    options: [
        {
            "name": "messageid",
            "description": "ID of the message to check for reaction.",
            "type": Constants.ApplicationCommandOptionTypes.STRING,
            "required": true,
        },
        {
            "name": "emoteid",
            "description": "The ID of the emote to add the role for.",
            "type": Constants.ApplicationCommandOptionTypes.STRING,
            "required": true,
        },
        {
            "name": "role",
            "description": "The role to add on reaction.",
            "type": Constants.ApplicationCommandOptionTypes.ROLE,
            "required": true,
        }
    ],
    async execute(interaction, client, mongoClient) {
        const message = await client.getMessage(
            interaction.channel.id,
            getOptionValue(interaction.data.options, "messageid")
        );

        const database = mongoClient.db("RunyBot");
        const messageCollection = database.collection("Messages");
        const result = await messageCollection.insertOne({
            channelID: interaction.channel.id,
            messageID: getOptionValue(interaction.data.options, "messageid"),
            emoteID: getOptionValue(interaction.data.options, "emoteid"),
            role: getOptionValue(interaction.data.options, "role")
        });

        interaction.createFollowup(`I've successfully created a reaction listener on the message!`);
    }
};
