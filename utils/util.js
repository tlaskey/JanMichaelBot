'use strict'
const jimp = require('jimp')
const fs = require('fs')
const mosh = require('datamosh')

const readPNG = async (url, imageId) => {
    try {
        const readImage = await jimp.read(url)
        await readImage.writeAsync(`images/${imageId}.jpg`)
    } catch (e) {
        console.log(e)
    }
}

const moshImage = async (imageId, dataMode) => {
    return new Promise((resolve, reject) => {
        mosh({
            read: `images/${imageId}.jpg`,
            write: `images/moshed_${imageId}.jpg`,
            dataMode: dataMode
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