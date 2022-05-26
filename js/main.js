'use strict'

const MINE = '💣'
const DEAD = '☠️'
const FLAG = '🏳'
const LIFE = '💝'
const HAPPY = '😍'
const WIN = '😇'
const LOSE = '🙄'

var gBoard
var gTotalMinesLeft
var gMinesPos
var gClicked
var gTimer
var gStartTime
var isTimerOn
addEventListener("contextmenu", e => e.preventDefault(false));

var gLevel = {
    size: 4,
    mines: 2,
}
// { size: 8, mines: 12, },
// { size: 12, mines: 30, },]

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}


function init() {
    gGame.isOn = true
    gBoard = createBoard()
    gMinesPos = []
    addRandomMines(gLevel.mines)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gTotalMinesLeft = gLevel.mines
    gClicked = 0
}

function createBoard() {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
            // console.log('cell', cell);
        }
    } console.log('board', board);
    return board
}

function renderBoard(board, selector) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            console.log('cell', cell);
            var className = 'cell cell-' + i + '-' + j

            if (cell.isMine === false) {
                if (cell.minesAroundCount === 0) {
                    strHTML += '<td oncontextmenu="cellMarked(this)" onclick="cellClicked(this)", data-i="' + i + '" data-j="' + j + '" class="' + className + '"></td>'
                } else {
                    strHTML += '<td oncontextmenu="cellMarked(this)" onclick="cellClicked(this)", data-i="' + i + '" data-j="' + j + '" class="' + className + '"></td>'
                }
            } else {
                strHTML += '<td oncontextmenu="cellMarked(this)" onclick="cellClicked(this)", data-i="' + i + '" data-j="' + j + '" class="' + className + '"></td>'
            }
        }
        strHTML += '</tr>'
    } //console.log('strHTML', strHTML);

    var elContainer = document.querySelector('table');
    elContainer.innerHTML = strHTML;
}

function countNeighbors(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j]
            if (cell.isMine) count++
        }
    }
    return count
}


function expandShown(board, idxI, idxJ) {
    for (var i = +idxI - 1; i <= +idxI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = +idxJ - 1; j <= +idxJ + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === +idxI && j === +idxJ) continue
            var cell = board[i][j]
            cell.isShown = true
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            elCell.classList.add('shown')

            if (cell.minesAroundCount === 0) {
                cell.isMarked = false
                elCell.innerText = ''
            }
            if (cell.minesAroundCount !== 0) {
                elCell.innerText = cell.minesAroundCount
                cell.isMarked = false
            }
        }
    }
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cellNegsCount = countNeighbors(gBoard, i, j)
            board[i][j].minesAroundCount = cellNegsCount
        }
    }
}


function addRandomMines(amount) {
    var mines = 0
    while (mines < amount) {
        var pos = {
            i: getRandomInt(0, gBoard.length),
            j: getRandomInt(0, gBoard.length)
        }
        if (gBoard[pos.i][pos.j].isMine === true) continue
        gBoard[pos.i][pos.j].isMine = true
        mines++
        gMinesPos.push(pos)
    }
}

function cellClicked(elCell) {
    if (!gGame.isOn) return
    if (gClicked === 0) startTimer()
    var pos = elCell.dataset
    elCell.classList.add('shown')
    var cellObj = gBoard[pos.i][pos.j]
    gBoard[pos.i][pos.j].isShown = true
    if (cellObj.isMine === true) {
        elCell.innerText = MINE

    } else if (cellObj.minesAroundCount === 0) {
        expandShown(gBoard, pos.i, pos.j)
        elCell.innerText = ''
    } else {
        elCell.innerText = cellObj.minesAroundCount
    }
    if (elCell.innerText === MINE) {
        gGame.isOn = false
        addSound()
        gameOver(elCell)
    }
    if (checkGameOver()) {
        endTimer()
        var elBtn = document.querySelector('.resetBtn')
        elBtn.innerText = '🙄'
        
        for (var i = 0; i < gMinesPos.length; i++) {
            var elMine = document.querySelector(`.cell-${gMinesPos[i].i}-${[gMinesPos[i].j]}`)
            elMine.innerText = MINE
            elMine.classList.add('shown')
            var currMine = gBoard[gMinesPos[i].i][gMinesPos[i].j]
            currMine.isShown = true
        }
        gameoverModal()
    }
    gClicked++
}

function cellMarked(elCell) {
    var pos = elCell.dataset
    var cell = gBoard[pos.i][pos.j]
    if(cell.isShown) return
    if(cell.isMarked){
        cell.isMarked = false
        elCell.innerText = ''
    }else{
        cell.isMarked = true
        elCell.innerText = FLAG
    }
}
function checkGameOver() {
    var cellsCount = gBoard.length ** 2
    var shownCount = 0
    var markedCount = 0
    var minesCount = gMinesPos.length
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown === true) shownCount++
            if (gBoard[i][j].isMarked === true) markedCount++
        }
    }
    if (shownCount === cellsCount - markedCount &&
        shownCount > 0 &&
        markedCount <= gMinesPos.length) {
        return true
    }
    return false
}
function gameOver(elCell) {
    endTimer()
    elCell.classList.add('lose-cell')
    for (var i = 0; i < gMinesPos.length; i++) {
        var elMine = document.querySelector(`.cell-${gMinesPos[i].i}-${[gMinesPos[i].j]}`)
        elMine.innerText = MINE
        elMine.classList.add('shown')
        var currMine = gBoard[gMinesPos[i].i][gMinesPos[i].j]
        currMine.isShown = true
    }
    var elBtn = document.querySelector('.resetBtn')
    elBtn.innerText = HAPPY
    gameoverModal()

}

function reset() {
    init()
    timerReset()
    var elBtn = document.querySelector('.resetBtn')
    elBtn.innerText = HAPPY
}

function gameoverModal(){
    var elAlert = document.querySelector('.gameoverModal')
    elAlert.style.display = 'block'
    setTimeout(() => {
        elAlert.style.display = 'none'
    }, 2000);
}


function toggleGame(elBtn) {
    endTimer()
    timerReset()

    if (elBtn.innerText === 'EASY') {
        gLevel.size = 4
        gLevel.mines = 2
    }
    if (elBtn.innerText === 'NORMAL') {
        gLevel.size = 8
        gLevel.mines = 12
    }
    if (elBtn.innerText === 'HARD') {
        gLevel.size = 12
        gLevel.mines = 30
    }

    reset()
}