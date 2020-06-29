'use strict'
require('dotenv').config()
const { readPNG, moshImage } = require('./util')
const Eris = require('eris')
const fs = require('fs')
const Board = require('./TicTacToe')

const GLOBAL_BOARDS = new Map()

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
        bot.deleteMessage(msg.channel.id, msg.id)
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

let userStart
let userChallenger

bot.registerCommand('tac', (msg, args) => {
    if (args[0] == 'start') {
        if (!userStart) {
            userStart = msg.author
            if (GLOBAL_BOARDS.has(userStart.id)) return bot.createMessage(msg.channel.id, `<@${userStart.id}> already has a game running!`)
            bot.createMessage(msg.channel.id, `<@${userStart.id}> has started a game of Tic Tac Toe! Who would like to challenge? Use '!tac accept' to start.`)
        }
        else return bot.createMessage(msg.channel.id, 'A game is already being started! Use !tac accept to be second player.')
    }
    if (args[0] == 'accept') {
        if (userStart) {
            userChallenger = msg.author
            if (userStart.id == userChallenger.id) return bot.createMessage(msg.channel.id, 'You cannot play against yourself!')

            if (GLOBAL_BOARDS.has(userChallenger.id)) return bot.createMessage(msg.channel.id, `<@${userChallenger.id}> is already in a game!`)

            bot.createMessage(msg.channel.id, `<@${userChallenger.id}> has accepted the challenge!`)

            let gameBoard = new Board(userStart.id, userChallenger.id)
            GLOBAL_BOARDS.set(userStart.id, gameBoard)
            GLOBAL_BOARDS.set(userChallenger.id, gameBoard)

            bot.createMessage(msg.channel.id, `<@${userStart.id}> is X's and goes first! ` + gameBoard.displayBoard())

            userStart = undefined
            userChallenger = undefined
        }
    }
    if (args[0] == 'move') {
        let gameBoard
        let user = msg.author

        if (GLOBAL_BOARDS.has(user.id)) gameBoard = GLOBAL_BOARDS.get(user.id)
        else return bot.createMessage(msg.channel.id, `<@${user.id}>. You do not have a game running. Use '!tac start' to start a game.`)

        if (args[1] && args[2]) {
            let xPos = Number(args[1])
            let yPos = Number(args[2])
            if (isNaN(xPos) || isNaN(yPos)) return bot.createMessage(msg.channel.id, 'Invalid argument types. xPos and yPos must be numbers.')

            if (gameBoard.playerTurn == user.id) {
                bot.createMessage(msg.channel.id, 'You gave me a move!')

                try {
                    bot.createMessage(msg.channel.id, gameBoard.updateBoard(xPos, yPos, gameBoard.players.get(user.id)))
                } catch (e) {
                    return bot.createMessage(msg.channel.id, e.toString())
                }

                const opponentID = gameBoard.getOpponent(user.id)
                gameBoard.playerTurn = opponentID

                if (gameBoard.hasWinner(xPos, yPos, gameBoard.players.get(user.id))) {
                    GLOBAL_BOARDS.delete(user.id)
                    GLOBAL_BOARDS.delete(opponentID)
                    return bot.createMessage(msg.channel.id, `<@${user.id}> has won!`)
                }
                if (gameBoard.hasDraw()) {
                    GLOBAL_BOARDS.delete(user.id)
                    GLOBAL_BOARDS.delete(opponentID)
                    return bot.createMessage(msg.channel.id, 'There has been a tie!')
                }
                return bot.createMessage(msg.channel.id, `<@${user.id}> has placed a ${gameBoard.players.get(user.id)} at row: ${xPos}, col: ${yPos}!`)
            }

            else return bot.createMessage(msg.channel.id, 'It is not your turn!')
        }
        else return bot.createMessage(msg.channel.id, 'Invalid arguments. Use \'!tac move xPos yPos\' to make a move.')
    }
    if (args[0] == 'quit') {
        if (GLOBAL_BOARDS.has(msg.author.id)) {
            const gameBoard = GLOBAL_BOARDS.get(msg.author.id)
            const opponentID = gameBoard.getOpponent(msg.author.id)
            GLOBAL_BOARDS.delete(msg.author.id)
            GLOBAL_BOARDS.delete(opponentID)

            return bot.createMessage(msg.channel.id, 'Your game has been stopped!')
        }
    }
    if (args[0] == 'help') {
        bot.createMessage(msg.channel.id, `
!tac start - Start a new game of Tic Tac Toe!
!tac accept - Accept the challenge and initialize a new game
!tac move [row] [col] - Move a piece to specified (x, y). Valid moves are numbers from 0-2.
!tac quit - Quit and end the game.
!tac help - Display commands and their usage.
        `)
    }
}, {
    description: 'Play a game of Tic Tac Toe!'
})

bot.registerCommand('remind', (msg, args) => {
    if (args[0] == 'help') {
        return bot.createMessage(msg.channel.id, `
        Command syntax: !remind <number> <s|m|h|d|m|w> "<message>" \nExample: !remind 30 m "Go let the dog out!"
        `)
    }

    let now = require('moment')()
    let numTime = args[0]
    let timeUnit = args[1]
    let remindTime = now.add(numTime, timeUnit)

    bot.createMessage(msg.channel.id, `I will remind you on: ${remindTime}. With the message ${args[2]}`)

    let CronJob = require('cron').CronJob
    let job = new CronJob(remindTime, () => {
        console.log('reminder sent!')
        bot.createMessage(msg.channel.id, `<@${msg.author.id}> Here is your reminder: \n ${args[2]}`)
    })

    console.log(`Starting cron job... reminder will execute on ${remindTime}`)
    job.start()
}, {
    description: 'Set a reminder to get something done on time!'
})

bot.connect()