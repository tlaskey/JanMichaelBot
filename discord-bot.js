'use strict'
require('dotenv').config()
const { readPNG, moshImage } = require('./util')
const Eris = require('eris')
const fs = require('fs')
const Board = require('./TicTacToe')

const bot = new Eris.CommandClient(process.env.DISCORD_TOKEN, {}, {
    description: 'The JanMichaelVincent Bot',
    owner: "Tyler Laskey",
    prefix: "!"
})

bot.on('ready', () => {
    console.log("Can I get a JanMichaelVincent?!")
})

bot.registerCommand('dm', async (msg, args) => {
    if (msg.attachments[0]) {
        const attachment = msg.attachments[0]
        let dataMode
        if (args.length > 0) {
            dataMode = args[0]
        }
        try {
            await readPNG(attachment.url, attachment.id)
            await moshImage(attachment.id, dataMode)
            await bot.createMessage(msg.channel.id, 'Moshed Image!', {
                file: fs.readFileSync(`images/moshed_${attachment.id}.jpg`),
                name: `moshed_${attachment.id}.jpg`
            })
            console.log('File sent!')
            fs.unlinkSync(`images/moshed_${attachment.id}.jpg`)
        } catch (e) {
            console.log(e)
            bot.createMessage(msg.channel.id, e)
        }
    }
    else return 'Invalid input.'
}, {
    description: 'Use Datamosh to mosh a lame image into a SCHIFTY pic!',

})

bot.registerCommand('tic', async (msg, args) => {
    bot.createMessage(msg.channel.id, `<@${msg.author.id}>! Who will challenge you to Tic Tac Toe?`)

    const userStart = msg.author
    bot.registerCommand('tac', (msg, args) => {
        const challenger = msg.author
        bot.createMessage(msg.channel.id, `<@${challenger.id}>! <@${userStart.id}> your challenger has appeared!`)

        let gameBoard = new Board()
        bot.createMessage(msg.channel.id, `<@${userStart.id}> is X's and goes first! ` + gameBoard.displayBoard())

        let players = {
            one: {
                info: userStart,
                type: 'x'
            },
            two: {
                info: challenger,
                type: 'o'
            }
        }

        // Need to figure out how to store who's turn it currently is.
        let currentMove = players.one
        bot.on('messageCreate', (msg) => {
            if (msg.content.startsWith('!move')) {
                if (msg.author.id == currentMove.info.id) {
                    const msgArray = msg.content.split(' ')

                    bot.createMessage(msg.channel.id, 'You gave me a move!')
                    bot.createMessage(msg.channel.id, gameBoard.updateBoard(msgArray[1], msgArray[2], currentMove.type))

                    if (gameBoard.hasWinner()) {
                        bot.createMessage(msg.channel.id, `<@${currentMove.info.id}> won!`)
                    }
                    else if (gameBoard.hasDraw()) {
                        bot.createMessage(msg.channel.id, 'It is a tie! Start a new game with !tic')
                    }
                    else {

                        bot.createMessage(msg.channel.id, `<@${currentMove.info.id}> has placed a ${currentMove.type} at row: ${msgArray[1]}, col: ${msgArray[2]}!`)
                    }
                }
                else 'It is not your turn!'
            }
            else 'You need to make a move with !move [row] [col]'
        })
    })
}, {
    description: 'Play a game of Tic Tac Toe!'
})

bot.connect()