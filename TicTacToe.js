class Board {
    constructor() {
        this.board = new Array(3)
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(3)
        }
        this.initBoard()
    }

    initBoard() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                this.board[i][j] = '-'
            }
        }
    }

    isFinished() {
        return false
    }

    hasWinner() {
        return false
    }

    hasDraw() {
        return false
    }

    updateBoard(row, col, value) {
        if (row < 0 || row >= this.board.length) throw new Error('Row index out of bounds')
        if (col < 0 || col >= this.board[0].length) throw new Error('Col index out of bounds')
        if (this.board[row][col] == '-') this.board[row][col] = value
        else throw new Error('Invalid move!')
        return this.displayBoard()
    }

    displayBoard() {
        const board = this.board
        let display =
            `
| ${board[0][0]} | ${board[0][1]} | ${board[0][2]} |
| ${board[1][0]} | ${board[1][1]} | ${board[1][2]} |
| ${board[2][0]} | ${board[2][1]} | ${board[2][2]} |
`
        return display
    }
}

module.exports = Board