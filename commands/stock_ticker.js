const baseUrl = 'https://api.polygon.io'
const aggregateUrl = `${baseUrl}/v2/aggs/ticker/`
const tickerInfoUrl = `${baseUrl}/v3/reference/tickers/`
const Client = require('reqi')
const BaseMessageEmbed = require('../utils/embeds/base-message-embed')
const moment = require('moment')
require('dotenv').config()
const dateFormat = 'YYYY-MM-DD'
const apiKey = process.env.POLYGON_API_KEY
const FIELDS_TO_GRAB = ['ticker', 'name', 'type', 'market_cap', 'description', 'total_employees']

const calculateData = (responseBody) => {
  const total = responseBody.count
  const dailyHighs = responseBody.results.map(day => day.h)
  const dailyLows = responseBody.results.map(day => day.l)
  const avgHigh = dailyHighs.reduce((sum, currentDayHigh) => sum + currentDayHigh) / total
  const avgLow = dailyLows.reduce((sum, currentDayLow) => sum + currentDayLow) / total
  return [avgHigh, avgLow, Math.max(...dailyHighs), Math.min(...dailyLows)]
}

// http://www.mredkj.com/javascript/numberFormat.html - format monetary values 234,129,421
const convertMarketCap = (nStr) => {
  nStr += ''
  const x = nStr.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? '.' + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2')
  }
  return x1 + x2
}
// hello
module.exports = {
  name: 'ticker',
  description: 'Get stock market ticker data',
  async execute(msg, args) {
    if (args[0] === 'help') {
      return msg.channel.send(
        new BaseMessageEmbed()
          .setDescription('Find stock market ticker information')
          .addField('Ticker Info', '!ticker info AAPL')
          .addField('Ticker Aggregate Info', '!ticker AAPL 3/22/2021 4/20/2021')
      )
    }
    if (args[0] && args[0].toLowerCase() === 'info') {
      if (!args[1]) {
        return msg.channel.send(
          new BaseMessageEmbed()
            .setDescription('Incorrect command usage, must supply a ticker symbol')
            .addField('Example', '!ticker info NVDA')
        )
      }
      const ticker = args[1].toUpperCase()
      const getURL = `${tickerInfoUrl}${ticker}?apiKey=${apiKey}`
      try {
        const ReqiClient = new Client({ json: true, retry: 2, retryCodes: [429] })
        const response = await ReqiClient.get(getURL)
        if (response.body.status !== 'OK') {
          return msg.channel.send(
            new BaseMessageEmbed()
              .setDescription(`Error grabbing info for ticker: ${ticker}`)
              .addField('message', response.body.message)
              .addField('status', response.body.status)
          )
        }
        const message = new BaseMessageEmbed()
          .setDescription('Ticker Info')
        Object.entries(response.body.results).filter((keyValue) => FIELDS_TO_GRAB.includes(keyValue[0]))
          .forEach((keyValue) => {
            const key = keyValue[0]
            if (key === 'market_cap') {
              return message.addField(key, `$${convertMarketCap(keyValue[1])}`)
            }
            return message.addField(key, keyValue[1])
          })
        return msg.channel.send(message)
      } catch (e) {
        console.log(e)
        return msg.channel.send(
          new BaseMessageEmbed()
            .addField('Error', e)
            .addField('Request URL', `${tickerInfoUrl}${ticker}`)
        )
      }
    }
    if (!args[0]) {
      return msg.channel.send(
        new BaseMessageEmbed()
          .setDescription('Incorrect command usage, must supply a ticker symbol')
          .addField('Example', '!ticker NVDA')
        )
    }
    const ticker = args[0].toUpperCase()
    const start = args[1] ? moment(args[1]).format(dateFormat) : moment().subtract(1, 'days').format(dateFormat)
    const end = args[2] ? moment(args[2]).format(dateFormat) : moment(start).add(1, 'days').format(dateFormat)
    try {
      if (moment(end).isBefore(moment(start))) {
        return msg.channel.send(
          new BaseMessageEmbed()
            .setDescription('Invalid dates entered, end date is before start date')
            .addField('Ticker', ticker)
            .addField('Dates', `Start: ${start}, End: ${end}`)
        )
      }
      const ReqiClient = new Client({ json: true, retry: 2, retryCodes: [429] })
      const limit = moment(end).diff(moment(start), 'days')
      const getURL = `${aggregateUrl}${ticker}/range/1/day/${start}/${end}?adjusted=true&sort=asc&limit=${limit}&apiKey=${apiKey}`
      const response = await ReqiClient.get(getURL)
      const responseBody = response.body
      const dataCount = responseBody.count
      const description = `Ticker ${ticker} aggregate data for dates between ${start} and ${end} with ${dataCount} datapoints`
      if (dataCount === 1) {
        const dayHigh = responseBody.results[0].h
        const dayLow = responseBody.results[0].l
        return msg.channel.send(
          new BaseMessageEmbed()
            .setDescription(description)
            .addField('High of', dayHigh)
            .addField('Low of', dayLow)
        )
      } else if (dataCount > 1) {
        const [avgHigh, avgLow, maxDailyHigh, minDailyLow] = calculateData(responseBody)
        return msg.channel.send(
          new BaseMessageEmbed()
            .setDescription(description)
            .addField('Avg Daily High', avgHigh)
            .addField('Avg Daily Low', avgLow)
            .addField('Max Daily High', maxDailyHigh)
            .addField('Min Daily Low', minDailyLow)
        )
      } else {
        return msg.channel.send(new BaseMessageEmbed()
          .setDescription("No aggregate data found, check that you're using the correct ticker symbol")
          .addField('Ticker', ticker))
      }
    } catch (e) {
      console.log(e)
      msg.channel.send(
        new BaseMessageEmbed()
          .addField('Error', e)
          .addField('Request URL', `${aggregateUrl}${ticker}/range/1/day/${start}/${end}?adjusted=true&sort=asc&limit=120`)
      )
    }
  }
}
