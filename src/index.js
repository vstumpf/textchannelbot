const { Client, Intents } = require('discord.js');
const { token, channels } = require('../config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('voiceStateUpdate', async (oldState, newState) => {

	// this could be a mute or deafen, don't leave/join
	if (oldState.channelId === newState.channelId)
		return;

	const newChans = channels.find(vctc => vctc.voice === newState.channelId);

	if (newChans) {
		const channel = await newState.guild.channels.fetch(newChans.text);
		if (channel.type === "GUILD_TEXT") {
			try {
				await channel.permissionOverwrites.edit(oldState.id, {VIEW_CHANNEL: true});
			} catch (err) {
				console.log(err);
			}
		}
	}

	const oldChans = channels.find(vctc => vctc.voice === oldState.channelId);

	if (oldChans) {
		const channel = await oldState.guild.channels.fetch(oldChans.text);
		if (channel.type === "GUILD_TEXT") {
			try {
				await channel.permissionOverwrites.delete(oldState.id);
			} catch (err) {
				console.log(err);
			}
		}
	}
});


// Login to Discord with your client's token
client.login(token);