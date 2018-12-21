const {Client} = require("discord.js"),
      randomColor = require("randomcolor"),
      fs = require("fs"),
      ms  = require("ms");

/**

  Check that all the values in the config.json are entered

*/

class RainbowClient extends Client {
  constructor(options){
    super(options);
    this.config = require("./config.json");
    this.loop = setInterval(()=>{},3000);
  }

  restartInterval(guild){
    clearInterval(this.loop);
    this.loop = setInterval(()=>{this.changeRoles(guild)}, ms(this.config.delay));
  }

  changeRoles(guild){

    this.config.roles.forEach(roleID => {

      const role = guild.roles.get(roleID);
      if(!role) return;

      role.edit({color: randomColor()});

    });
  }

  writeConfig(){
    fs.writeFile("./config.json", JSON.stringify(this.config), (err) => {
      if(err)return console.error(err);
    });

    // return this.config = JSON.parse(fs.readFileSync("./config.json", "utf8"))
  }

}


const client = new RainbowClient()

client.login(client.config.token);


client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}\nPrefix: ${client.config.prefix}\nRotation delay: ${client.config.delay}\nRoles:${client.config.roles.length}`)
  client.guilds.forEach(guild => {
    client.restartInterval(guild);
  });
});


client.on('message', async message => {
  if(!message.content.startsWith(client.config.prefix) || !message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch (command) {
    case "roles":

    if(!args[0] || message.mentions.roles.size === 0) return
    const role = message.mentions.roles.first()


      if(args[0] === "add"){
        if(client.config.roles.includes(role.id)) return message.channel.send('Role is already in list')
        client.config.roles.push(role.id);
        message.channel.send(`Role ${role.name} added`);
        console.log(`Role ${role.name} added`)
      }
      else if(args[0] === "list"){
        let roles = new Array();
        client.config.roles.forEach(r =>{
          roles.push(message.guild.roles.get(r));
        })
        message.channel.send("Roles: "+roles);
      }
      else if(args[0] === "remove"){
        const index = client.config.roles.indexOf(role.id);
        if(index === -1)return message.channel.send('Role isn\'t in list')
        client.config.roles.splice(index, 1);
        message.channel.send(`Role ${role.name} Removed`);
        console.log(`Role ${role.name} Removed`)
      }


      client.writeConfig();
      client.restartInterval(message.guild);

      break;
    case "prefix":
      if(!args[0]) return message.channel.send(`Prefix : ${client.config.prefix}`);
      if(!message.member.hasPermission('MANAGE_ROLES')) return; // pas la perm
      client.config.prefix = args[0];
      console.log(`Prefix changed to : ${client.config.prefix}`)
      message.channel.send(`Prefix changed to : ${client.config.prefix}`)
      client.writeConfig();
      break;

    case "delay":
      if(!args[0]) return message.channel.send(`Prefix : ${client.config.prefix}`);
      if(!message.member.hasPermission('MANAGE_ROLES')) return; // pas la perm
      client.config.delay = args[0];
      console.log(`Delay changed to : ${client.config.delay}`)
      message.channel.send(`Delay changed to : ${client.config.delay}`)
      client.writeConfig();
      client.restartInterval(message.guild);
      break;
  }
});


process.on('unhandledRejection', reason => {
  if(reason.name !== "DiscordAPIError") return;
  if(reason.message === "Missing Permissions"){

    const guild = client.guilds.get(reason.path.substring(15,33));
    const role = guild.roles.get(reason.path.substring(40,58));

    console.log(`I don't have the permission to change the role ${role.name}`);
  }

});
