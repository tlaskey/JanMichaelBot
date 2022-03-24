const fs = require('fs')
const Discord = require('discord.js')
require('dotenv').config()

const prefix = '!'

const client = new Discord.Client()

client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)

  client.commands.set(command.name, command)
}

client.on('ready', () => {
  console.log('Can I get a JanMichaelVincent?!')
})

client.on('message', (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return
  let args = msg.content.slice(prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  if (command === 'remind') {
    // https://stackoverflow.com/questions/4031900/split-a-string-by-whitespace-keeping-quoted-segments-allowing-escaped-quotes
    args = msg.content.slice(prefix.length).match(/\w+|"(?:\\"|[^"])+"/g)
    client.commands.get(command).execute(msg, args)
  } else if (command === 'dm') {
    client.commands.get(command).execute(msg, args)
  } else if (command === 'ticker' || command === 't') {
    client.commands.get('ticker').execute(msg, args)
  }
})

client.login(process.env.DISCORD_TOKEN)
