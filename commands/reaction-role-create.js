const Eris = require("eris");
const { MongoClient } = require('mongodb');
const getOptionValue = require("../utils/eris/getOptionValue.js");
const Constants = Eris.Constants;

module.exports = {
    name: "reaction-role-create",
    description: "Flags a message to be checked for a reaction and signals to add a specified role based on it.",
    defaultMemberPermissions: 268435456,
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
        const database = mongoClient.db("RunyBot");
        const collection = database.collection("Messages");

        if ((await collection.countDocuments({
            channelID: interaction.channel.id,
            messageID: getOptionValue(interaction.data.options, "messageid"),
            emoteID: getOptionValue(interaction.data.options, "emoteid"),
            role: getOptionValue(interaction.data.options, "role")
        })) === 0) {
            const result = await collection.insertOne({
                channelID: interaction.channel.id,
                messageID: getOptionValue(interaction.data.options, "messageid"),
                emoteID: getOptionValue(interaction.data.options, "emoteid"),
                role: getOptionValue(interaction.data.options, "role")
            });

            interaction.createFollowup(`I've successfully created a reaction listener on the message!`);
        } else {
            interaction.createFollowup("This exact reaction listener configuration is already active!");
        }
    }
};
