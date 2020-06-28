class Board {
    constructor() {
        this.board = new Array(3)
        this.moveCount = 0
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

    hasWinner(x, y, type) {
        const board = this.board
        let n = board.length
        // Only need to check horizontal, vertical, and diagonals based off x, y

        // check row
        for (let col = 0; col < n; col++) {
            if (board[x][col] != type) break
            if (col == n - 1) return true
        }

        // check col
        for (let row = 0; row < n; row++) {
            if (board[row][y] != type) break
            if (row == n - 1) return true
        }

        // check diag
        if (x == y) {
            for (let i = 0; i < n; i++) {
                if (board[i][i] != type) break
                if (i == n - 1) return true
            }
        }

        // check anti-diag
        if (x + y == n - 1) {
            for (let i = 0; i < n; i++) {
                if (board[i][(n - 1) - i] != type) break
                if (i == n - 1) return true
            }
        }
        return false
    }

    hasDraw() {
        return this.moveCount == 9
    }

    updateBoard(row, col, value) {
        if (row < 0 || row >= this.board.length) throw new Error('Row index out of bounds')
        if (col < 0 || col >= this.board[0].length) throw new Error('Col index out of bounds')
        if (this.board[row][col] == '-') {
            this.board[row][col] = value
            this.moveCount++
        }
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