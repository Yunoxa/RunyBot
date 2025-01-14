const Eris = require("eris");
const Commands = require("./commands");
require('dotenv').config();

const client = new Eris(`Bot ${process.env.TOKEN}`);

client.on("ready", () => {
    const guilds = ["1252623727376732231"];
    guilds.forEach(guildID => {
        for (const command in Commands) {
            client.createGuildCommand(guildID, {
                name: Commands[command].name,
                description: Commands[command].description,
                options: Commands[command].options
            });
        }
    });

    console.log("Ready!");
});

client.on("interactionCreate", async(interaction) => {
    console.log("Command called: " + interaction.data.name);

    for (const command in Commands) {
        if (interaction.data.name == Commands[command].name) {
            await interaction.defer();
            console.log(`Executing ${interaction.data.name}...`);
            await Commands[command].execute(interaction, client).catch((error) => {
                interaction.createFollowup(`**Error**: ${error}`);
                console.error('Error:', error);
            });
            console.log(`I've finished executing ${interaction.data.name}!`);
        }
    }
});

client.on("messageReactionAdd", async(message) => {
    console.log(`Reaction added || Message ID: ${message.id} || Channel ID: ${message.channel.id}`);
});

client.on("messageReactionRemove", async(message) => {
    console.log(`Reaction removed || Message ID: ${message.id} Channel ID: ${message.channel.id}`);
});

client.connect();
