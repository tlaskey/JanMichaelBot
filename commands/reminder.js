module.exports = {
    name: 'remind',
    description: 'Set a reminder to get something done on time!',
    execute(msg, args) {
        if (args[0] == 'help') {
            return msg.channel.send(`
            Command syntax: !remind <number> <s|m|h|d|m|w> "<message>" \nExample: !remind 30 m "Go let the dog out!"
            `)
        }

        if (!args[0] || !args[1] || !args[2]) return msg.channel.send('You must specify a time, time unit, and message. Run "!remind help" for example usage.')
        if (!args[2].startsWith("\"") || !args[2].endsWith("\"")) return msg.channel.send('Message must be surrounded by \"" e.g. "Let the dog out!"')

        let now = require('moment')()
        let numTime = args[0]
        let timeUnit = args[1]
        let remindTime = now.add(numTime, timeUnit)

        msg.channel.send(`I will remind you on: ${remindTime}. With the message ${args[2]}`)

        let CronJob = require('cron').CronJob
        let job = new CronJob(remindTime, () => {
            console.log('reminder sent!')
            msg.channel.send(`<@${msg.author.id}> Here is your reminder: \n ${args[2]}`)
        })

        console.log(`Starting cron job... reminder will execute on ${remindTime}`)

        job.start()
    }
}