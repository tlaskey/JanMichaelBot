const fs = require('fs')
const { readPNG, moshImage } = require('../utils/util')
const Path = require('path')
const HelpMessageEmbed = require('../utils/embeds/help-message-embed')

module.exports = {
    name: 'dm',
    description: 'Use Datamosh to mosh a lame image into a SCHIFTY pic!',
    async execute(msg, args) {
        if (args[0] === 'help') {
            const embedHelp = new HelpMessageEmbed()
                .addField('!dm [mode]', 'modes: blurbobb, schifty, veneneux, vana, fatcat')

            return msg.channel.send(embedHelp)
        }

        const attachment = msg.attachments.first()

        if (attachment) {
            let dataMode = args[0]

            try {
                await readPNG(attachment.url, attachment.id)
                await moshImage(attachment.id, dataMode)

                const path = Path.join(`images/moshed_${attachment.id}.png`)
                const mode = (dataMode === undefined) ? 'random' : dataMode

                await msg.channel.send(`moshed image in ${mode} mode!`, {
                    files: [{
                        attachment: path,
                        name: `moshed_${attachment.id}.png`
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