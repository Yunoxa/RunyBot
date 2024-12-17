import { Client } from "eris";
import "dotenv/config";

const client = new Client(`Bot ${process.env.TOKEN}`, {
    intents: ["guilds", "guildMembers", "guildPresences", "guildMessages"]
});

client.on("ready", () => {
    const guilds = JSON.parse(process.env.GUILDIDLIST);
    guilds.forEach(guildID => {
        client.createGuildCommand(guildID, {
            name: "pop",
            description: "Pops",
        });
    });

    console.log("Ready!");
});

client.on("interactionCreate", (interaction) => {
    console.log("Command executed: " + interaction.data.name)
    if(interaction.data.name === "pop") {
        interaction.createMessage("***Pop*** ***Pop*** ***Pop***");
    }
});

client.connect();