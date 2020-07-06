const Discord = require('discord.js')

class HelpMessageEmbed extends Discord.MessageEmbed {
  constructor () {
    super()
      .setColor('#34BEBA')
      .setTitle('JanMichaelBot Help')
      .setThumbnail('https://vignette.wikia.nocookie.net/rickandmorty/images/0/07/S2e8_Jan.png/')
      .setTimestamp()
  }
}

module.exports = HelpMessageEmbed
