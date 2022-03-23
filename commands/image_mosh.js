const moshImage = require('../utils/util')
const MODES = require('datamosh').MODES
const ImageMessageEmbed = require('../utils/embeds/image-message-embed')
const BaseMessageEmbed = require('../utils/embeds/base-message-embed')
const LIMIT = 25 // arbitrary limit as of now, sometimes it crashes

module.exports = {
  name: 'dm',
  description: 'Use Datamosh to mosh a lame image into a SCHIFTY pic!',
  async execute (msg, args) {
    if (args[0] === 'help') {
      const embedHelp = new BaseMessageEmbed()
        .addField('!dm mode', `modes: ${Object.keys(MODES)}`)
        .addField('Moshing', 'Soon to be removed from JanMichaelBot')
      return msg.channel.send(embedHelp)
    }

    const attachment = msg.attachments.first()

    if (attachment) {
      let modes = args
      try {
        modes.filter((mode) => Object.prototype.hasOwnProperty.call(MODES, mode))

        if (modes.length > LIMIT) modes = modes.slice(0, LIMIT)

        if (modes === undefined || modes.length === 0) modes = null

        const moshedImage = await moshImage(attachment.url, modes)

        if (!modes) modes = 'random'

        const name = `moshed_${attachment.id}.png`
        const embed = new ImageMessageEmbed(moshedImage, name).addField('Author', `<@${msg.author.id}>`).addField('moshed image using', `${modes} mode!`)

        await msg.channel.send(embed)

        console.log('File sent!')

        await msg.delete()
      } catch (e) {
        console.log(e)
        msg.channel.send(new BaseMessageEmbed().addField('Error', e))
      }
    }
  }
}
