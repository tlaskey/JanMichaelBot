const Eris = require('eris')

const reminder = new Eris.Command('remind', (msg, args) => {
    const bot = require('../discord-bot')
    if (args[0] == 'help') {
        return bot.createMessage(msg.channel.id, `
        Command syntax: !remind <number> <s|m|h|d|m|w> "<message>" \nExample: !remind 30 m "Go let the dog out!"
        `)
    }

    if (!args[0] || !args[1] || !args[2]) return bot.createMessage(msg.channel.id, 'You must specify a time, time unit, and message. Run "!remind help" for example usage.')
    if (!args[2].startsWith("\"") || !args[2].endsWith("\"")) return bot.createMessage(msg.channel.id, 'Message must be surrounded by \"" e.g. "Let the dog out!"')

    let now = require('moment')()
    let numTime = args[0]
    let timeUnit = args[1]
    let remindTime = now.add(numTime, timeUnit)

    bot.createMessage(msg.channel.id, `I will remind you on: ${remindTime}. With the message ${args[2]}`)

    let CronJob = require('cron').CronJob
    let job = new CronJob(remindTime, () => {
        console.log('reminder sent!')
        bot.createMessage(msg.channel.id, `<@${msg.author.id}> Here is your reminder: \n ${args[2]}`)
    })

    console.log(`Starting cron job... reminder will execute on ${remindTime}`)

    job.start()
}, {
    description: 'Set a reminder to get something done on time!'
})

module.exports = reminder