const Eris = require('eris')
const fs = require('fs')
const { readPNG, moshImage } = require('../utils/util')
const Path = require('path')

const image_mosh = new Eris.Command('dm', async (msg, args) => {
    const bot = require('../discord-bot')
    if (msg.attachments[0]) {
        const attachment = msg.attachments[0]
        let dataMode
        if (args.length > 0) {
            dataMode = args[0]
        }
        try {
            await bot.deleteMessage(msg.channel.id, msg.id)
            await readPNG(attachment.url, attachment.id)
            // await moshImage(attachment.id, dataMode)
            // const path = Path.join('../', 'utils', `images/moshed_${attachment.id}.jpg`)
            // await bot.createMessage(msg.channel.id, 'Moshed Image!', {
            //     file: fs.readFileSync(path),
            //     name: `moshed_${attachment.id}.jpg`
            // })
            // console.log('File sent!')
            // fs.unlinkSync(path)
        } catch (e) {
            console.log(e)
            bot.createMessage(msg.channel.id, e)
        }
    }
    else return 'Invalid input.'
}, {
    description: 'Use Datamosh to mosh a lame image into a SCHIFTY pic!',

})

module.exports = image_mosh