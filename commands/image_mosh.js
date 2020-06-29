const fs = require('fs')
const { readPNG, moshImage } = require('../utils/util')
const Path = require('path')

module.exports = {
    name: 'dm',
    description: 'Use Datamosh to mosh a lame image into a SCHIFTY pic!',
    async execute(msg, args) {
        const attachment = msg.attachments.first()
        if (attachment) {
            console.log(attachment)
            let dataMode
            if (args.length > 0) {
                dataMode = args[0]
            }
            try {
                await readPNG(attachment.url, attachment.id)
                await moshImage(attachment.id, dataMode)
                const path = Path.join(`images/moshed_${attachment.id}.jpg`)
                await msg.channel.send('moshed image!', {
                    files: [{
                        attachment: path,
                        name: `moshed_${attachment.id}.jpg`
                    }]
                })
                console.log('File sent!')
                fs.unlinkSync(path)
                await msg.delete()
            } catch (e) {
                console.log(e)
                msg.channel.send(e)
            }
        }
    }
}