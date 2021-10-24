const Discord = require("discord.js");
const client = new Discord.Client({ws: { intents: new Discord.Intents(Discord.Intents.ALL)}});
const fse = require("fs-extra");
const fs = require("fs");

client.once("ready", () => {
    console.log(`${client.user.tag} listo !!!`);
});

async function ExistWhitelist(user){
    var path = `./whitelist/${user}.json`;
    try {
        return fs.existsSync(path);
    } catch (e) {return false;}
}

async function CreateWhitelist(user){
    fse.outputFile(`./whitelist/${user}.json`, `{"whitelist": 0}`).then(() => {
        console.log(`bot agregado`);
    }).catch(err => console.log(err));
}

client.on("guildMemberAdd", async function(member) {
    if(member.user.bot) {
        var tiene = await ExistWhitelist(member.user.id);
        if(!tiene){
            member.ban().then((user) => {
                // Successmessage
                client.channels.cache
                .get(`698285641880043551`) //Add id of the channel where you will notify about the entry of the bot
                .send('@everyone alerta!!!! alguien agrego el bot llamado ' + member.user.tag + " ID= " + member.user.id); //Message the bot will say
            }).catch(() => {
                // Failmessage
                console.log("Access Denied");
            });
        }
    }
});

client.on("message", async message => {
    let prefix = "r/"; //Your Prefix
    if (message.author.bot) return;
    // This is where we'll put our code.
    if (message.content.indexOf(prefix) !== 0) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "addbot") {
        if(message.member.roles.cache.find(r => r.name ===  "《🌠》➺┇ Manager")){ //Name of the role that will be allowed to execute the command
        let ids = args[0];
        if (!args.length)
        return message.channel.send('Necesitas poner la id del bot que quieres agregar');
        var tiene = await ExistWhitelist(ids);
        if(!tiene) {
            try {
                CreateWhitelist(ids);
                message.channel.send("El bot se registro con exito") //It will send this message if the bot was added correctly
                .catch(console.error);
              }catch (error) {
                message.channel.send("No se puede registrar el bot en estos momentos"); //It will send this message if there was an error adding the bot
              }
        } else {
            message.channel.send("Este bot ya esta en la whitelist"); //In case it is already added
        }
          } else {
              message.reply("No tienes el rol necesario"); //In case the user who executed the command does not have the role
          }
    }
})

client.login('Token'); // Your token
