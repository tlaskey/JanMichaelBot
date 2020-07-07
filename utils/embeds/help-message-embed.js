const Discord = require('discord.js')

class HelpMessageEmbed extends Discord.MessageEmbed {
  constructor() {
    super()
      .setColor('#34BEBA')
      .setTitle('JanMichaelBot')
      .setThumbnail('https://vignette.wikia.nocookie.net/rickandmorty/images/0/07/S2e8_Jan.png/')
      .setFooter(`JanMichaelBot v${require('../../package.json').version}`)
      .setURL('https://github.com/tlaskey/JanMichaelBot')
      .setTimestamp()
  }
}

module.exports = HelpMessageEmbed
