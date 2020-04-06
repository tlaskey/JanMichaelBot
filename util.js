'use strict'
const jimp = require('jimp')
const fs = require('fs')
const mosh = require('datamosh')

module.exports.moshPNG = (imageURL, imageId, dataMode) => {
    const imageJpgPath = `images/${imageId}.jpg`
    let moshedImage
    jimp.read(imageURL, (err, image) => {
        if (err) console.error(err)
        else {
            image.write(imageJpgPath)
            const imagePath = `images/${imageId}.jpg`
            const moshedImagePath = `images/moshed_${imageId}.jpg`
            mosh({ read: imagePath, write: moshedImagePath, mode: dataMode }, (err, data) => {
                if (err) console.error(err)
                else {
                    console.log('data', data)
                    moshedImage = data
                }
            })
            fs.unlink(imagePath, (err) => {
                if (err) console.error(`err -> ${err} \n ${imagePath} not deleted`)
                else console.log(`${imagePath} succesfully deleted.`)
            })
        }
    })
    return moshedImage
}