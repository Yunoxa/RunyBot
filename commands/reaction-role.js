const Eris = require("eris");
const Constants = Eris.Constants;
const getOptionValue = require("../utils/eris/getOptionValue.js");

module.exports = {
    name: "reaction-role",
    description: "Flags a message to be checked for a reaction and signals to add a specified role based on it.",
    options: [
        {
          "name": "channelid",
          "description": "ID of channel containing the message.",
          "type": Constants.ApplicationCommandOptionTypes.STRING,
          "required": true,
        },
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
            "type": Constants.ApplicationCommandOptionTypes.STRING,
            "required": true,
        }
    ],
    execute(interaction) {
        console.log(`ChannelID: ${getOptionValue(interaction.data.options, "channelid")}`);
        console.log(`MessageID: ${getOptionValue(interaction.data.options, "messageid")}`);
        console.log(`Reaction: ${getOptionValue(interaction.data.options, "reaction")}`);
        console.log(`Role: ${getOptionValue(interaction.data.options, "role")}`);
        interaction.createFollowup(`I've finished setting a reaction listener on the message!`);
    }
};