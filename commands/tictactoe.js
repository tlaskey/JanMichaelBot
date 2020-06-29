const Board = require('../utils/board')
const Eris = require('eris')

const GLOBAL_BOARDS = new Map()

let userStart
let userChallenger

const tictactoe = new Eris.Command('tac', (msg, args) => {
    const bot = require('../discord-bot')
    if (args[0] == 'start') {
        if (!userStart) {
            userStart = msg.author
            if (GLOBAL_BOARDS.has(userStart.id)) return bot.createMessage(msg.channel.id, `<@${userStart.id}> already has a game running!`)
            return bot.createMessage(msg.channel.id, `<@${userStart.id}> has started a game of Tic Tac Toe! Who would like to challenge? Use '!tac accept' to start.`)
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

module.exports = tictactoe