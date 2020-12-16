"use strict"

//Declaring all global variables
let body = document.querySelector("body")
let finalScore = document.querySelector("#finalScore")
let backgroundMusic = document.querySelector("audio")
let input = document.querySelector("#input")
let countDownDisplay = document.querySelector("#count")
let displayScore = document.querySelector("#score")
let rangeField = document.querySelector("#sensibilty")
let submitSensibilty = document.querySelector("#validateSens")
let inputPanel = document.querySelector("#form")
let spaceship = document.querySelector("#icon")
let fireball
let sensibilty
let score = 1
let intervalScore
let userName = document.querySelector("#name")
let parametersPanel = document.querySelector("#parameters")
let parametersIcon = document.querySelector("#general")
let validateInput = document.querySelector("#begin-game")
let fireballArray = []
let fireballElement

//Pre-check
function onlyOnPc() {
 if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent)) {
  alert("Sorry, Game only works on computer")
  body.style.display = "none"}}

 //event.keyCode
 document.addEventListener('keydown', function(e) {
  if (e.keyCode !== null) { backgroundMusic.play() }})


//Sensibilty Panel
parametersIcon.addEventListener("click", function() {
 parametersPanel.style.display = "block" })
function dragElement() {
 let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
 if (document.getElementById(parametersPanel.id + "header")) {
  document.getElementById(parametersPanel.id + "header").onmousedown = dragMouseDown }
 else {parametersPanel.onmousedown = dragMouseDown }

 function dragMouseDown(e) {
  window.event; e.preventDefault()
  pos3 = e.clientX
  pos4 = e.clientY
  document.onmouseup = function() {
   document.onmouseup = null
   document.onmousemove = null }
  document.onmousemove = elementDrag }

 function elementDrag(e) {
  window.event; e.preventDefault()
  pos1 = pos3 - e.clientX
  pos2 = pos4 - e.clientY
  pos3 = e.clientX
  pos4 = e.clientY
  parametersPanel.style.top = (parametersPanel.offsetTop - pos2) + "px"
  parametersPanel.style.left = (parametersPanel.offsetLeft - pos1) + "px" }}

function isolateRangeSlider(event) { event.stopPropagation() }


//parameters sensibilty
function validateSens() {
 inputPanel.style.filter = "none"
 parametersPanel.style.display = "none"
 clearInterval(sensibilty)
 let changeSensibilty = parseFloat(rangeField.value)
 switch (changeSensibilty) {
  case 1: sensibilty = setInterval(loop, 13); break
  case 2: sensibilty = setInterval(loop, 8); break
  case 3: sensibilty = setInterval(loop, 5); break }}


//Input validation
input.addEventListener("keydown", function(event) {
 if (event.keyCode === 13) { event.preventDefault(); validateInput.click() }})
function validateForm() {
 input.value = input.value.toLowerCase()
 if (input.value == "admin") {backgroundMusic.muted = "true"}
 try {
  if (input.value == "") throw "Complete blanks"
  if (!input.value.match(/^[A-Za-z]+$/)) throw "Only letters allowed"
  if (input.value.length < 3) throw "Must have at least 3 characters" }
 catch (inputError) { alert(inputError); return false }
 inputPanel.style.display = "none"; StartGame()

 //Full screen
 document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement) { location.reload() }})
 document.addEventListener('keyup', function(e) {
  if (input.value == "admin") { this.removeEventListener('keyup', arguments.callee, false) }
  if (e.keyCode !== null) { document.documentElement.requestFullscreen() }})}


function StartGame() {
 document.querySelector(".alert").style.display = "none"
 let count = 3
 var stopCountDown = setInterval(CountDown, 1000)
 countDownDisplay.style.display = "block"
 countDownDisplay.style.animation = "count-down 10s"
 function CountDown() {
  countDownDisplay.innerHTML = count
  if (count > 0) { count-- }
  else { clearInterval(stopCountDown); countDownDisplay.style.display = "none" }}

 //Set Timeout before game starts
 setTimeout(function() {
  sensibilty = setInterval(loop, 8)
  parametersIcon.style.display = "block"
  userName.style.display = "block"
  userName.innerHTML = "Player: " + "<a style=color:#4dc3ff;text-decoration:none> @" + input.value + "</a>"
  function GameScore() { displayScore.innerHTML = "Score: " + score; score++ }
  intervalScore = setInterval(GameScore, 100)
  spaceship.style.display = 'block'
  spaceship.style.animation = "blinkSpaceship 1s"

  //Sensibilty shortcuts
  document.addEventListener('keydown', function(e) {
   if (e.keyCode == 49) { rangeField.value = 1; submitSensibilty.click() }
   if (e.keyCode == 50) { rangeField.value = 2; submitSensibilty.click() }
   if (e.keyCode == 51) { rangeField.value = 3; submitSensibilty.click() }})

  //Toogle spacehips when spacebar pressed
  const toogleImages =
   ["Photo/Spaceship1.png",
   "Photo/Spaceship2.png",
   "Photo/Spaceship3.png",
   "Photo/Spaceship4.png",
   "Photo/Spaceship5.png",
   "Photo/Spaceship6.png",
   "Photo/Spaceship7.png"]
  document.body.onkeydown = function(e) {
  if (e.keyCode === 32) { hits++; spaceship.src = toogleImages[hits % 7] }}

  //Fireball script
  function generateFireBallWithAttributes(el, attrs) {
  for (var key in attrs) { el.setAttribute(key, attrs[key]) }
  return el }

  function createFireBalls(amount) {
   for (let i = 0; i <= amount; i++) {
    fireball = document.createElement("img")
    fireballArray.push(generateFireBallWithAttributes(fireball, {
     src: "Photo/fireball.png" }))}}

  createFireBalls(13)

  fireballArray.forEach((fireballElement) => {
   body.appendChild(fireballElement)
   const fireballMovement = { x: fireballRandom(fireballElement.offsetWidth), y: 0 }
   const fireLoop = function() {
    fireballMovement.y += 2
    fireballElement.style.top = fireballMovement.y + "px"
   if (fireballMovement.y > window.innerHeight) {
    fireballMovement.x = fireballRandom(fireballElement.offsetWidth)
    fireballElement.style.left = fireballMovement.x + "px"
    fireballMovement.y = 0 }}
   fireballElement.style.left = fireballMovement.x + "px"
   let fireInterval = setInterval(fireLoop, 1000 / ((Math.random() * 50 + 80)))})

  function fireballRandom(offset) {
  return Math.floor(Math.random() * (window.innerWidth - offset))}}, 4000)}

//Spaceship moves into space + prevent going out borders
let hits = 0
let pos = { top: 1000, left: 570 }
const keys = {}
window.addEventListener("keydown", function(e) { keys[e.keyCode] = true })
window.addEventListener("keyup", function(e) { keys[e.keyCode] = false })

const loop = function() {
 if (keys[37] || keys[81]) { pos.left -= 5 }
 if (keys[39] || keys[68]) { pos.left += 5 }
 if (keys[38] || keys[90]) { pos.top -= 5 }
 if (keys[40] || keys[83]) { pos.top += 2 }
 if (pos.left < 0) { pos.left = 0 }
 if (pos.top < 0) { pos.top = 0 }
 if (pos.left + spaceship.offsetWidth >= body.offsetWidth) {
  pos.left = body.offsetWidth - spaceship.offsetWidth }
 if (pos.top + spaceship.offsetHeight >= body.offsetHeight) {
  pos.top = body.offsetHeight - spaceship.offsetHeight }
 spaceship.setAttribute("data", body.offsetWidth + ":" + body.offsetHeight)
 spaceship.style.left = pos.left + "px"; spaceship.style.top = pos.top + "px"
 checkCollision() }


//Stop game on collision
function detectOverlap(fireball) {
 const shipRect = spaceship.getBoundingClientRect()
 const fireballRect = fireball.getBoundingClientRect()
 if (( shipRect.x + shipRect.width > fireballRect.x
  && shipRect.x < fireballRect.x + fireball.width) &&
  (shipRect.y + shipRect.height > fireballRect.y
  && shipRect.y < fireballRect.y + fireball.height )) return true }

//Collision Detection
function checkCollision() {
 let collision = false
 fireballArray.forEach(function(fireballCollision) {
  if (detectOverlap(fireballCollision)) { return collision = true }})

 if (collision === true) {
  if (input.value == "admin") return false
  fireballArray.forEach(function(fireballElement) {
   return fireballElement.style.display = "none" })
  backgroundMusic.muted = "true"
  spaceship.style.display = "none"
  stopGame.style.display = "block"
  stopGame.style.animation = "animationStopGame 6.5s forwards"
  clearInterval(intervalScore)
  finalScore.style.display = "block"
  finalScore.innerHTML = "Your score was: " + score
  finalScore.style.animation = "animationStopGame 6.5s forwards"
  parametersPanel.style.display = "none"
  parametersIcon.style.display = "none"
  userName.style.display = "none"
  displayScore.style.display = "none"
  setTimeout(function() { location.reload() }, 5500)}}
