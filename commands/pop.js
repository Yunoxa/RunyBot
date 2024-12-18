const Eris = require("eris");
const Constants = Eris.Constants;

module.exports = {
    name: "pop",
    description: "pops",
    options: [
        {
          "name": "target",
          "description": "Target of popping.",
          "type": Constants.ApplicationCommandOptionTypes.STRING,
          "required": true,
        }
    ],
    execute(interaction) {
        interaction.createMessage(`Runybot stares at ${interaction.data.options[0].value} and ***Pops***`);
    }
};