const fs = require('fs')
const mosh = require('datamosh')
const Path = require('path')
const jimp = require('jimp')

const readPNG = async (url, imageId) => {
    try {
        const readImage = await jimp.read(url)
        await readImage.writeAsync(`images/${imageId}.png`)
    } catch (e) {
        console.log(e)
    }
}

const moshImage = async (imageId, dataMode) => {
    return new Promise((resolve, reject) => {
        const read = Path.join('./', `images/${imageId}.png`)
        const write = Path.join('./', `images/moshed_${imageId}.png`)
        mosh({
            read,
            write,
            dataMode
        }, (error) => {
            if (error) reject(error)
            else {
                fs.unlinkSync(`images/${imageId}.png`)
                resolve()
            }
        })
    })
}

module.exports = {
    readPNG,
    moshImage
}