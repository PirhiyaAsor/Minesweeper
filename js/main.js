'use strict'

const MINE = '💣'
const DEAD = '☠️'
const FLAG = '🏴'
const LIFE = '💝'
const HAPPY = '😍'
const WIN = '😇'
const LOSE = '🙄'

var gMines;
var gCell;
var gCurrNum;
var gIntervalId;
var gStartTime;
var gNums;

var gBoard = {
    minesAroundCount: 4,
    isShown: true,
    isMine: false,
    isMarked: true,
    
}

var gLevel = 
    {size: 4, mines: 2}
    // {size: 8, mines: 12}
    // {size: 12, mines: 30}

var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}


function initGame() {
    gLevel = {
        size: gLevel[0].size,
        mines: gMines,
    }
    createBoard()
    renderBoard()

    // gCurrNum = 1
    // startGame()
}

// creating the board -----------
function createBoard() {
    var board = [];

    // var nums = createNums(gNums);
    // nums = shuffle(nums)

    for (var i = 0; i < gLevel.size; i++) {
        board.push([]);
        for (var j = 0; j < gLevel[0].size; j++) {
            board[i][j] =  board.push([]);  //nums.pop();
        }
    }
    return board;
}



function setMinesNegsCount(board)



// render the board --------------
function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < gLevel[0].size; j++) {
            var cell = board[i][j];
            strHTML += `<td onclick='cellClicked(this)'>${cell}</td>`;
        }
        strHTML += '</tr>';
    }console.log('strHTML' + strHTMl);
    }

    var elTable = document.querySelector('table tbody');
    elTable.innerHTML = strHTML;
// 
function cellClicked(elCell, i, j) {
    var cellsCount = gLevel ** 2;
    var cellNum = +elCell.innerText;
    if (cellNum === gCurrNum) {
        if (gCurrNum === 1) {
            // startTimer()
        }
        elCell.style.backgroundColor = 'green';
        // gCurrNum++;
    }
    // if (gCurrNum > cellsCount) {
        //     alert('Well Done!');
        //     clearInterval(gIntervalId)
        // }
    }
    
    /*
function cellMarked(elCell)


function checkGameOver()

function expandShown(board, elCell, i, j)

*/

function chooseDifficulty(level) {
    gLevel = level
    gCurrNum = 1;
    startGame()
}

function createNums(nums) {
    var nums = []
    for (var i = 1; i <= 3 ; i++) {
        nums.push(i)
    }
    console.log(nums);
    return nums
}
/*

function shuffle(nums) {
    return nums.sort((a, b) => 0.5 - Math.random());
}


function startGame() {
    gBoard = createBoard();
    renderBoard(gBoard);
}*/