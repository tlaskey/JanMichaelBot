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

        let currentPlayer
        let playerTurn = true
        bot.registerCommand('move', (msg, args) => {

            if (playerTurn) currentPlayer = players.one
            else currentPlayer = players.two

            const xPos = Number(args[0])
            const yPos = Number(args[1])

            if (msg.author.id == currentPlayer.info.id) {
                if (isNaN(xPos) || isNaN(yPos)) return bot.createMessage(msg.channel.id, 'Invalid move parameters.')

                bot.createMessage(msg.channel.id, 'You gave me a move!')
                bot.createMessage(msg.channel.id, gameBoard.updateBoard(xPos, yPos, currentPlayer.type))

                if (gameBoard.hasWinner(xPos, yPos, currentPlayer.type)) {
                    bot.createMessage(msg.channel.id, `<@${currentPlayer.info.id}> won!`)
                }
                else if (gameBoard.hasDraw()) {
                    bot.createMessage(msg.channel.id, 'It is a tie! Start a new game with !tic')
                }
                else {
                    bot.createMessage(msg.channel.id, `<@${currentPlayer.info.id}> has placed a ${currentPlayer.type} at row: ${xPos}, col: ${yPos}!`)
                }
                playerTurn = !playerTurn
            }
            else bot.createMessage(msg.channel.id, 'It is not your turn!')
        })
    })
}, {
    description: 'Play a game of Tic Tac Toe!'
})

bot.connect()