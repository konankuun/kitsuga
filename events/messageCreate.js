const Discord = require("discord.js");

module.exports = async (bot, message) => {

    let db = bot.db;
    if (message.author.bot || message.channel.type === Discord.ChannelType.DM) return;

    db.query(`SELECT * FROM server WHERE guild = '${message.guild.id}'`, async (err, req) => {
        if (req.length < 1) {
            db.query(`INSERT INTO server (guild, role) VALUES ('${message.guild.id}', 'false')`)
        }
    });
}
