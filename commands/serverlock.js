const ms = require('ms');
var serverLock = false;
module.exports = {
    name: 'serverlock',
    description: 'Lock the server.',
    aliases: ['lockserver', 'serverlockdown'],
    async execute(client, message, args, Hyperz, config){

        if(message.guild.id === config["main_config"].yourserverid) {

            const per = config["permissions_config"].serverlockperms
            if(message.member.roles.cache.some(h=>per.includes(h.id))){

                client.on('guildMemberAdd', async member => {
                if(member.guild.id === config["main_config"].yourserverid) {
                    if(serverLock) {
                        try{

                            const embed = new Hyperz.MessageEmbed()
                            .setColor(config["main_config"].colorhex)
                            .setTitle(`⚠️  Notification  ⚠️`)
                            .setAuthor(`${member.user.tag}`, `${member.user.displayAvatarURL()}`, `${config["other_configuration"].serverinvite}`)
                            .setDescription(`This is an automated message to inform you, that you have been __removed__ from **${member.guild.name}**.\n\n**Reason:** Server is in Lockdown Mode. We recommend you try joining at a later time!`)
                            .setTimestamp()
                            .setFooter(`${config["main_config"].copyright}`)

                            member.send(embed).catch(e => {if(config["main_config"].debugmode) return console.log(e);});

                        } catch(e) {

                            if(config["main_config"].debugmode) return console.log(e);

                        }

                        setTimeout(() => {
                            member.kick(`Server lockdown.`);
                            if(config["main_config"].debugmode) return console.log(`${member.user.tag} was kicked, server lockdown.`);
                        }, 2500)

                        if(config["logging_config"].enable_serverlock_logging) {
                            config["logging_config"].serverlock_logging_channels.forEach(chan => {
        
                                const thechannel = client.channels.cache.get(chan)
                                if(!thechannel) {
                                    console.log("One of the channels entered in the config.json file is not properly configured. Please make sure you use Channel ID's. Not Names.")
                                } else {
                                    const logembed = new Hyperz.MessageEmbed()
                                    .setColor(`${config["main_config"].colorhex}`)
                                    .setTitle(`Lockdown Removal!`)
                                    .setThumbnail(`${member.user.avatarURL()}`)
                                    .addFields(
                                        {name: `User:`, value: `${member.user.tag}`},
                                        {name: `Action:`, value: `Kicked`},
                                        {name: `Reason:`, value: `Server Lockdown`},
                                    )
                                    .setTimestamp()
                                    .setFooter(`${config["main_config"].copyright}`)
    
                                    thechannel.send(logembed).catch(e => {if(config["main_config"].debugmode) return console.log(e);})
                                }
                            
                            });
                        }

                    }
                }
                });
            
                var farts = {};
            
                farts.toggleServerLock = function(bruhchan) {
                    serverLock = !serverLock;
                    bruhchan.send(`Server lockdown toggled: \`${serverLock}\``)

                    if(config["logging_config"].enable_serverlock_logging) {
                        config["logging_config"].serverlock_logging_channels.forEach(chan => {

                            let cringe = message.member
    
                            const thechannel = client.channels.cache.get(chan)
                            if(!thechannel) {
                                console.log("One of the channels entered in the config.json file is not properly configured. Please make sure you use Channel ID's. Not Names.")
                            } else {
                                const logembed = new Hyperz.MessageEmbed()
                                .setColor(`${config["main_config"].colorhex}`)
                                .setTitle(`Server Lockdown Toggled!`)
                                .setThumbnail(`${cringe.user.avatarURL()}`)
                                .addFields(
                                    {name: `User:`, value: `${cringe.user.tag}`},
                                    {name: `Toggled:`, value: `${serverLock}`},
                                )
                                .setTimestamp()
                                .setFooter(`${config["main_config"].copyright}`)

                                thechannel.send(logembed).catch(e => {if(config["main_config"].debugmode) return console.log(e);})
                            }
                        
                        });
                    }

                };

                farts.toggleServerLock(message.channel);

            } else {
                message.channel.send("You don't have permission to run this command...").then(msg => msg.delete({ timeout: 9000 })).catch(e => {if(config["main_config"].debugmode) return console.log(e);})
                message.delete().catch(err => {if(config["main_config"].debugmode) return console.log(err);});
            }

        } else {
            message.channel.send("This command can only be ran inside of the main server.").then(msg => msg.delete({ timeout: 9000 })).catch(e => {if(config["main_config"].debugmode) return console.log(e);})
            message.delete().catch(err => {if(config["main_config"].debugmode) return console.log(err);});
        }

    }
}

