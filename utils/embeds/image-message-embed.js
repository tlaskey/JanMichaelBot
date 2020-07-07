const BaseImageEmbed = require('./base-message-embed')

class ImageMessageEmbed extends BaseImageEmbed {
    constructor(image, name) {
        const file = {
            attachment: image,
            name
        }
        super()
            .setColor('#34BEBA')
            .setTitle('JanMichaelBot')
            .attachFiles([file])
            .setImage(`attachment://${file.name}`)
    }
}

module.exports = ImageMessageEmbed