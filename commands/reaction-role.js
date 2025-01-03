const Eris = require("eris");
const { MongoClient } = require('mongodb');
const getOptionValue = require("../utils/eris/getOptionValue.js");
require('dotenv').config();
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
            "name": "reaction",
            "description": "The reaction to add the role for.",
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
    async execute(interaction, client) {
        const message = await client.getMessage(
            interaction.channel.id,
            getOptionValue(interaction.data.options, "messageid")
        );

        console.log(message);

        const mongoClient = new MongoClient(process.env.MONGOURI);
        await mongoClient.connect();

        const database = mongoClient.db("RunyBot");
        const messageCollection = database.collection("Messages");
        const result = await messageCollection.insertOne({
            channelID: interaction.channel.id,
            messageID: getOptionValue(interaction.data.options, "messageid"),
            reaction: getOptionValue(interaction.data.options, "reaction"),
            role: getOptionValue(interaction.data.options, "role")
        });
        console.log(result);

        await mongoClient.close();

        interaction.createFollowup(`I've finished setting a reaction listener on the message!`);
    }
};