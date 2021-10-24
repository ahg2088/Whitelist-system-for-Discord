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
                .get(`698285641880043551`)
                .send('@everyone alerta!!!! alguien agrego el bot llamado ' + member.user.tag + " ID= " + member.user.id);
            }).catch(() => {
                // Failmessage
                console.log("Access Denied");
            });
        }
    }
});

client.on("message", async message => {
    let prefix = "r/";
    if (message.author.bot) return;
    // This is where we'll put our code.
    if (message.content.indexOf(prefix) !== 0) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "addbot") {
        if(message.member.roles.cache.find(r => r.name ===  "《🌠》➺┇ Manager")){
        let ids = args[0];
        if (!args.length)
        return message.channel.send('Necesitas poner la id del bot que quieres agregar');
        var tiene = await ExistWhitelist(ids);
        if(!tiene) {
            try {
                CreateWhitelist(ids);
                message.channel.send("El bot se registro con exito")
                .catch(console.error);
              }catch (error) {
                message.channel.send("No se puede registrar el bot en estos momentos");
              }
        } else {
            message.channel.send("Este bot ya esta en la whitelist");
        }
          } else {
              message.reply("Andate a la ctm que no tienes permiso");
          }
    }
})

client.login('Token');