const BaseMessageEmbed = require('../utils/embeds/base-message-embed')

module.exports = {
  name: 'remind',
  description: 'Set a reminder to get something done on time!',
  execute(msg, args) {
    if (args[1] === 'help') {
      const embedHelp = new BaseMessageEmbed()
        .addField('!remind [numTime] [unit] "[message]"', 'Example: !remind 1 h "Let Anna outside!"')

      return msg.channel.send(embedHelp)
    }

    if (!args[1] || !args[2] || !args[3]) return msg.channel.send('You must specify a time, time unit, and message. Run "!remind help" for example usage.')

    const reminderMsg = args[3]
    if (!reminderMsg.startsWith('"') || !reminderMsg.endsWith('"')) return msg.channel.send('Message must be surrounded by "" e.g. "Let the dog out!"')

    const now = require('moment-timezone')().tz('America/Los_Angeles')
    const numTime = args[1]
    const timeUnit = args[2]
    const remindTime = now.add(numTime, timeUnit)

    msg.channel.send(`I will remind you on: ${remindTime}. With the message ${args[3]}`)

    const CronJob = require('cron').CronJob

    const job = new CronJob(remindTime, () => {
      console.log('reminder sent!')
      msg.channel.send(`<@${msg.author.id}> Here is your reminder: \n ${args[3]}`)
    })

    console.log(`Starting cron job... reminder will execute on ${remindTime}`)

    job.start()
  }
}
