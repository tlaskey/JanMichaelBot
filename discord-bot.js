'use strict'
require('dotenv').config()
const { readPNG, moshImage } = require('./util')
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

bot.registerCommand('dm', async (msg, args) => {
    if (msg.attachments[0]) {
        const attachment = msg.attachments[0]
        let dataMode
        if (args.length > 0) {
            dataMode = args[0]
        }
        try {
            await readPNG(attachment.url, attachment.id)
            await moshImage(attachment.id, dataMode)
            await bot.createMessage(msg.channel.id, 'Moshed Image!', {
                file: fs.readFileSync(`images/moshed_${attachment.id}.jpg`),
                name: `moshed_${attachment.id}.jpg`
            })
            fs.unlinkSync(`images/moshed_${attachment.id}.jpg`)
        } catch (e) {
            console.log(e)
            bot.createMessage(msg.channel.id, e)
        }
    }
    else return 'Invalid input.'
}, {
    description: 'Use Datamosh to mosh a lame image into a SCHIFTY pic!',

})

bot.connect()