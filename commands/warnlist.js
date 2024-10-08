const Discord = require("discord.js")

module.exports = {
    name: "warnlist",
    description: "Afficher la liste des avertissements",
    utilisation: "/warnlist <membre>",
    permission: Discord.PermissionFlagsBits.ManageMessages,
    dm: false,
    category: "Modération",
    options: [
        {
            type: "user",
            name: "membre",
            description: "Le membre averti",
            required: true,
            autocomplete: false
        }
    ],


    async run(bot, message, args, db){

        let user = args.getUser("membre")
        if(!user) return message.reply("Pas de membre spécifié.")

        let member = message.guild.members.cache.get(user.id)
        if(!member) return message.reply("Aucun membre trouvé.")
        
        db.query(`SELECT * FROM warns WHERE guild = '${message.guildId}' AND user = '${user.id}'`, async(err, req) =>{
            if(req.length < 1) return message.reply("Ce membre n'a aucun avertissements.")
            await req.sort((a, b) =>parseInt (b.date) - parseInt(a.date))

            let Embed = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setTitle(`Liste des avertissements de ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: "Avertissements"})

            for(let i = 0; i < req.length; i++){
                Embed.addFields([{name: `Avertissement numéro ${i+1}`, value: `> **Auteur** : ${(await bot.users.fetch(req[i].author)).tag}\n> **ID** : ${req[i].warn}\n> **Raison** : ${req[i].reason}\n> **Date** : <t:${Math.floor(parseInt(req[i].date / 1000 ))}:F>`}])
            }
            await message.reply({embeds: [Embed]})
        })
    }
}