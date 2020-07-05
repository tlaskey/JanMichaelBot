const HelpMessageEmbed = require('../utils/embeds/help-message-embed')

module.exports = {
    name: 'remind',
    description: 'Set a reminder to get something done on time!',
    execute(msg, args) {
        if (args[1] == 'help') {
            const embedHelp = new HelpMessageEmbed()
                .addField('!remind [numTime] [unit] "[message]"', 'Example: !remind 1 h "Let Anna outside!"')

            return msg.channel.send(embedHelp)
        }

        if (!args[1] || !args[2] || !args[3]) return msg.channel.send('You must specify a time, time unit, and message. Run "!remind help" for example usage.')

        let reminderMsg = args[3]
        if (!reminderMsg.startsWith("\"") || !reminderMsg.endsWith("\"")) return msg.channel.send('Message must be surrounded by \"" e.g. "Let the dog out!"')

        let now = require('moment')()
        let numTime = args[1]
        let timeUnit = args[2]
        let remindTime = now.add(numTime, timeUnit)

        msg.channel.send(`I will remind you on: ${remindTime}. With the message ${args[3]}`)

        let CronJob = require('cron').CronJob

        let job = new CronJob(remindTime, () => {
            console.log('reminder sent!')
            msg.channel.send(`<@${msg.author.id}> Here is your reminder: \n ${args[3]}`)
        })

        console.log(`Starting cron job... reminder will execute on ${remindTime}`)

        job.start()
    }
}