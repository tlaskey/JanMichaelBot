const jimp = require('jimp')
const fs = require('fs')
const mosh = require('datamosh')
const Path = require('path')

const readPNG = async (url, imageId) => {
    try {
        const readImage = await jimp.read(url)
        await readImage.writeAsync(`images/${imageId}.jpg`)
    } catch (e) {
        console.log('error url', url)
        console.log(e)
    }
}

const moshImage = async (imageId, dataMode) => {
    return new Promise((resolve, reject) => {
        const read = Path.join('./', `images/${imageId}.jpg`)
        const write = Path.join('./', `images/moshed_${imageId}.jpg`)
        mosh({
            read,
            write,
            dataMode
        }, (error) => {
            if (error) reject(error)
            else {
                fs.unlinkSync(`images/${imageId}.jpg`)
                resolve()
            }
        })
    })
}

module.exports = {
    readPNG,
    moshImage
}