require('dotenv').config()
const Eris = require('eris')
const fs = require('fs')

const bot = new Eris.CommandClient(process.env.DISCORD_TOKEN, {}, {
    description: 'The JanMichaelVincent Bot',
    owner: "Tyler Laskey",
    prefix: "!"
})

bot.on('ready', () => {
    console.log("Can I get a JanMichaelVincent?!")
})

// Add Command Objects to CommandClient (Registers all commands to bot.)
const commandArray = fs.readdirSync('./commands')
for (let i = 0; i < commandArray.length; i++) {
    let command = commandArray[i]
    const commandObject = require(`./commands/${command}`)
    bot.commands[`${commandObject.label}`] = commandObject
}

bot.connect()

module.exports = bot