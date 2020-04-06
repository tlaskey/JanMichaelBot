'use strict'
require('dotenv').config()
const { moshPNG } = require('./util')
const Eris = require('eris')

const bot = new Eris.CommandClient(process.env.DISCORD_TOKEN, {}, {
    description: 'The JanMichaelVincent Bot',
    owner: "ur mum",
    prefix: "!"
})

bot.on('ready', () => {
    console.log("Can I get a JanMichaelVincent?!")
})

bot.registerCommand('dm', (msg, args) => {
    if (msg.attachments[0]) {
        const attachment = msg.attachments[0]
        const newImage = moshPNG(attachment.url, attachment.id, args[0])
        return newImage
    }
    else return "Invalid input"
}, {
    description: 'Use Datamosh to mosh a lame image into a SCHIFTY pic!',

})

bot.connect()