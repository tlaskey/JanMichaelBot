const url = 'https://api.polygon.io/v2/aggs/ticker/'
const Client = require('reqi')
const BaseMessageEmbed = require('../utils/embeds/base-message-embed')
const moment = require('moment')
require('dotenv').config()
const apiKey = process.env.POLYGON_API_KEY

module.exports = {
  name: 'ticker',
  description: 'Get stock prices of company ticker symbol',
  async execute (msg, args) {
    if (args[0] === 'help') {
      const embedHelp = new BaseMessageEmbed()
        .setDescription('Finds high/low price of a stock ticker symbol')
        .addField('Example command usage', '!ticker AAPL')
      return msg.channel.send(embedHelp)
    }

    try {
      const ticker = args[0]
      const currentTime = moment().subtract(1, 'days').format('YYYY-MM-DD')
      const ReqiClient = new Client({ json: true })
      const getURL = `${url}${ticker}/range/1/day/${currentTime}/${currentTime}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`
      console.log(getURL)
      const request = await ReqiClient.get(getURL)
      const body = request.body
      if (body.count > 0) {
        const dayHigh = body.results[0].h
        const dayLow = body.results[0].l
        msg.channel.send(
          new BaseMessageEmbed()
            .setDescription(`Ticker ${ticker} aggregate data for today ${currentTime}`)
            .addField('High of', dayHigh)
            .addField('Low of', dayLow)
        )
      } else {
        const message = new BaseMessageEmbed()
          .setDescription("No aggregate data found, check that you're using the correct ticker symbol")
          .addField('Ticker', ticker)
        msg.channel.send(message)
      }
    } catch (e) {
      console.log(e)
      msg.channel.send(
        new BaseMessageEmbed()
          .addField('Error', e)

      )
    }
  }
}
