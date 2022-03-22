const mosh = require('datamosh')
const jimp = require('jimp')

const moshImage = async (url, mode) => {
  const read = await jimp.read(url)
  const buffer = await read.getBufferAsync(jimp.MIME_PNG)
  return new Promise((resolve, reject) => {
    mosh(buffer, mode, (error, data) => {
      if (error) reject(error)
      else {
        resolve(data)
      }
    })
  })
}

module.exports = moshImage
