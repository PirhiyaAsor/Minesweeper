'use strict'
console.log('hoooo');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function startTimer() {
    gStartTime = new Date
    isTimerOn = true
    gTimer = setInterval(runTimer,90)
}
function runTimer() {
    if (isTimerOn) {
        var end = new Date
        var time = (end - gStartTime) / 1000
        var elTimer = document.querySelector('.timer')
        elTimer.innerText = time.toFixed(2)
    }
}

function addSound() {
	var audio = new Audio('sound/explosion.mp3')
	audio.play()
}

function endTimer() {
    isTimerOn = false
    clearInterval(gTimer)
}
function timerReset() {
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = '00:00'
}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }