const BaseMessageEmbed = require('../utils/embeds/base-message-embed')

module.exports = {
  name: 'coinflip',
  description: 'Random heads or tails coinflip.',
  execute (msg, args) {
    if (args[0] === 'help') {
      const embedHelp = new BaseMessageEmbed()
        .addField('!coinflip coinFace', 'coinFace is either heads or tails.')

      return msg.channel.send(embedHelp)
    }

    const coinFace = args[0]
    const map = new Map([['heads', 0], ['tails', 1]])

    if (coinFace && map.has(coinFace)) {
      const playerChoice = map.get(coinFace)

      const randFace = Math.round(Math.random())

      if (playerChoice === randFace) return msg.channel.send(`The coin landed on ${coinFace}, you win!`)
      return msg.channel.send('You lose!')
    } else return msg.channel.send('Argument should be either heads or tails')
  }
}
