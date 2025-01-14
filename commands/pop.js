const Eris = require("eris");
const Constants = Eris.Constants;

module.exports = {
    name: "pop",
    description: "pops",
    async execute(interaction) {
        interaction.createFollowup(`***pop pop pop***`);
    }
};
