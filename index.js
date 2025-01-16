const Eris = require("eris");
const Commands = require("./commands");
const { MongoClient } = require("mongodb");
require('dotenv').config();

const client = new Eris(`Bot ${process.env.TOKEN}`);
const mongoClient = new MongoClient(process.env.MONGOURI);


client.on("ready", () => {
    const guilds = ["1252623727376732231"];
    guilds.forEach(guildID => {
        for (const command in Commands) {
            client.createGuildCommand(guildID, {
                name: Commands[command].name,
                description: Commands[command].description,
                defaultMemberPermissions: Commands[command].defaultMemberPermissions,
                options: Commands[command].options
            });
        }
    });

    console.log("Ready!");
});

client.on("interactionCreate", async(interaction) => {
    console.log("Command called: " + interaction.data.name);

    for(const command in Commands) {
        if(interaction.data.name == Commands[command].name) {
            await interaction.defer(64);
            console.log(`Executing ${interaction.data.name}...`);
            await Commands[command].execute(interaction, client, mongoClient).catch((error) => {
                interaction.createFollowup(`**Error**: ${error}`);
                console.error('Error:', error);
            });
            console.log(`I've finished executing ${interaction.data.name}!`);
        }
    }
});

client.on("messageReactionAdd", async(message, emoji, reactor) => {
    if(!emoji.id) {
        emoji.id = emoji.name
    }

    console.log(`Reaction added || Message ID: ${message.id} || Channel ID: ${message.channel.id} || Reactor: ${reactor.username} || Emote: ${emoji.id}`);

    const database = mongoClient.db("RunyBot");
    const getListenedMessages = await database.collection("Messages").find({
        messageID: message.id,
        channelID: message.channel.id,
        emoteID: emoji.id
    });

    const listenedMessages = [];
    for await (const doc of getListenedMessages) {
        listenedMessages.push(doc);
    }

    listenedMessages.forEach((listener) => {
        client.addGuildMemberRole(reactor.guild.id, reactor.id, listener.role, "Reaction role")
              .catch((error) => {
                  console.log(error);
              });
        console.log(`The user ${reactor.username} reacted to the message ${message.id} which has a listener set for the emoji ${listener.emoteID} (${emoji.name}), granting them the ${listener.role} role.`);
    });
});

client.on("messageReactionRemove", async(message, emoji, userID) => {
    if(!emoji.id) {
        emoji.id = emoji.name
    }

    console.log(`Reaction removed || Message ID: ${message.id} Channel ID: ${message.channel.id}`);

    const database = mongoClient.db("RunyBot");
    const getListenedMessages = await database.collection("Messages").find({
        messageID: message.id,
        channelID: message.channel.id,
        emoteID: emoji.id
    });

    const listenedMessages = [];
    for await (const doc of getListenedMessages) {
        listenedMessages.push(doc);
    }

    listenedMessages.forEach((listener) => {
        client.removeGuildMemberRole(message.guildID, userID, listener.role, "Reaction role")
              .catch((error) => {
                  console.log(error);
              });
        console.log(`The user ${userID} removed their reaction to the message ${message.id} which has a listener set for the emoji ${listener.emoteID} (${emoji.name}), removing their ${listener.role} role.`);
    });
});

mongoClient.connect();
client.connect();
