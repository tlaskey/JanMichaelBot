const moshImage = require('../utils/util')
const MODES = require('datamosh').MODES
const ImageMessageEmbed = require('../utils/embeds/image-message-embed')
const BaseMessageEmbed = require('../utils/embeds/base-message-embed')

module.exports = {
  name: 'dm',
  description: 'Use Datamosh to mosh a lame image into a SCHIFTY pic!',
  async execute (msg, args) {
    if (args[0] === 'help') {
      const embedHelp = new BaseMessageEmbed()
        .addField('!dm mode', `modes: ${Object.keys(MODES)}`)

      return msg.channel.send(embedHelp)
    }

    const attachment = msg.attachments.first()

    if (attachment) {
      const dataMode = args[0]

      try {
        let mode = (Object.prototype.hasOwnProperty.call(MODES, dataMode)) ? dataMode : null

        const moshedImage = await moshImage(attachment.url, mode)

        if (!mode) mode = 'random'

        const name = `moshed_${attachment.id}.png`
        const embed = new ImageMessageEmbed(moshedImage, name).addField('moshed image using', `${mode} mode!`)

        await msg.channel.send(embed)

        console.log('File sent!')

        await msg.delete()
      } catch (e) {
        console.log(e)
        msg.channel.send(e)
      }
    }
  }
}
