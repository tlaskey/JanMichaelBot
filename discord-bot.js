const fs = require('fs')
const Discord = require('discord.js')
const { prefix, token } = require('./config.json')

const client = new Discord.Client()

client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command)
}

client.on('ready', () => {
    console.log("Can I get a JanMichaelVincent?!")
})

client.on('message', (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return

    const args = msg.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if (command === 'remind') {
        client.commands.get('remind').execute(msg, args)
    }
    else if (command === 'dm') {
        client.commands.get('dm').execute(msg, args)
    }
    else if (command === 'tac') {
        client.commands.get('tac').execute(msg, args)
    }
})

client.login(token)