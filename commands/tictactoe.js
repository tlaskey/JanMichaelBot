const Board = require('../utils/board')
const Discord = require('discord.js')

const GLOBAL_BOARDS = new Map()

let userStart
let userChallenger

module.exports = {
    name: 'tac',
    description: 'Play a game of Tic Tac Toe!',
    execute(msg, args) {
        if (args[0] == 'start') {
            if (!userStart) {
                userStart = msg.author
                if (GLOBAL_BOARDS.has(userStart.id)) return msg.channel.send(`<@${userStart.id}> already has a game running!`)
                return msg.channel.send(`<@${userStart.id}> has started a game of Tic Tac Toe! Who would like to challenge? Use '!tac accept' to start.`)
            }
            else return msg.channel.send('A game is already being started! Use !tac accept to be second player.')
        }
        if (args[0] == 'accept') {
            if (userStart) {
                userChallenger = msg.author
                if (userStart.id == userChallenger.id) return msg.channel.send('You cannot play against yourself!')

                if (GLOBAL_BOARDS.has(userChallenger.id)) return msg.channel.send(`<@${userChallenger.id}> is already in a game!`)

                msg.channel.send(`<@${userChallenger.id}> has accepted the challenge!`)

                let gameBoard = new Board(userStart.id, userChallenger.id)
                GLOBAL_BOARDS.set(userStart.id, gameBoard)
                GLOBAL_BOARDS.set(userChallenger.id, gameBoard)

                msg.channel.send(`<@${userStart.id}> is X's and goes first! ` + gameBoard.displayBoard())

                userStart = undefined
                userChallenger = undefined
            }
        }
        if (args[0] == 'move') {
            let gameBoard
            let user = msg.author

            if (GLOBAL_BOARDS.has(user.id)) gameBoard = GLOBAL_BOARDS.get(user.id)
            else return msg.channel.send(`<@${user.id}>. You do not have a game running. Use '!tac start' to start a game.`)

            if (args[1] && args[2]) {
                let xPos = Number(args[1])
                let yPos = Number(args[2])
                if (isNaN(xPos) || isNaN(yPos)) return msg.channel.send('Invalid argument types. xPos and yPos must be numbers.')

                if (gameBoard.playerTurn == user.id) {
                    msg.channel.send('You gave me a move!')

                    try {
                        msg.channel.send(gameBoard.updateBoard(xPos, yPos, gameBoard.players.get(user.id)))
                    } catch (e) {
                        return msg.channel.send(e.toString())
                    }

                    const opponentID = gameBoard.getOpponent(user.id)
                    gameBoard.playerTurn = opponentID

                    if (gameBoard.hasWinner(xPos, yPos, gameBoard.players.get(user.id))) {
                        GLOBAL_BOARDS.delete(user.id)
                        GLOBAL_BOARDS.delete(opponentID)
                        return msg.channel.send(`<@${user.id}> has won!`)
                    }
                    if (gameBoard.hasDraw()) {
                        GLOBAL_BOARDS.delete(user.id)
                        GLOBAL_BOARDS.delete(opponentID)
                        return msg.channel.send('There has been a tie!')
                    }
                    return msg.channel.send(`<@${user.id}> has placed a ${gameBoard.players.get(user.id)} at row: ${xPos}, col: ${yPos}!`)
                }

                else return msg.channel.send('It is not your turn!')
            }
            else return msg.channel.send('Invalid arguments. Use \'!tac move xPos yPos\' to make a move.')
        }
        if (args[0] == 'quit') {
            if (GLOBAL_BOARDS.has(msg.author.id)) {
                const gameBoard = GLOBAL_BOARDS.get(msg.author.id)
                const opponentID = gameBoard.getOpponent(msg.author.id)
                GLOBAL_BOARDS.delete(msg.author.id)
                GLOBAL_BOARDS.delete(opponentID)

                return msg.channel.send('Your game has been stopped!')
            }
        }
        if (args[0] == 'help') {
            const embedHelp = new Discord.MessageEmbed()
                .setColor('#F727B5')
                .setTitle('JanMichaelBot Help')
                .addField('!tac start', 'Start a new game of Tic Tac Toe!')
                .addField('!tac accept', 'Accept the challenge and initialize a new game.')
                .addField('!tac move [row] [col]', 'Valid moves are from 0-2.')
                .addField('!tac quit', 'Quit the game. Loser!')
                .addField('!tac help', 'Display commands and their usage.')
                .setThumbnail('https://vignette.wikia.nocookie.net/rickandmorty/images/0/07/S2e8_Jan.png/')
                .setTimestamp()

            msg.channel.send(embedHelp)
        }
    }
}