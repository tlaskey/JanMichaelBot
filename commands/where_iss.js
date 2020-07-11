const ReqiClient = require('reqi')
const BaseMessageEmbed = require('../utils/embeds/base-message-embed')

module.exports = {
  name: 'iss',
  description: 'Get current ISS location!',
  async execute (msg, args) {
    try {
      const client = new ReqiClient({ json: true })

      const issURL = 'https://api.wheretheiss.at/v1/satellites/25544'
      const issData = await client.get(issURL)

      const geoURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${issData.body.longitude}, ${issData.body.latitude}.json?access_token=${process.env.GEOCODE_KEY}`
      const geoData = await client.get(geoURL)

      if (geoData.body.features === undefined) return await msg.channel.send('Location not found. Must be outta this world...')

      const embed = new BaseMessageEmbed().addField('ISS Location', JSON.stringify(geoData.body.features[0]))

      await msg.channel.send(embed)
    } catch (e) {
      console.log(e)
    }
  }
}
