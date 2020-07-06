const mosh = require('datamosh')
const jimp = require('jimp')

const moshImage = async (url, mode) => {
    const read = await jimp.read(url)

    return new Promise((resolve, reject) => {
        mosh({
            read: read.bitmap,
            mode
        }, (error, data) => {
            if (error) reject(error)
            else {
                resolve(data)
            }
        })
    })
}

module.exports = moshImage