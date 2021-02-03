"use strict"

let body = document.querySelector("body");
let input = document.querySelector("input");
let spaceship = document.querySelector("#icon");
let fireball;
let sensibilty;
let score = 1;
let intervalScore;
let fireballArray = new Array;
let fireballElement;

input.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.querySelector("form > button").click()
  }
})

function ValidateSettings() {
  if (document.getElementById("fpscheck").checked) {
    FpsCounter()
  }
  document.querySelector("form").style.filter = "none";
  document.querySelector("section").style.display = "none";
  clearInterval(sensibilty);
  let changeSensibilty = parseInt(document.getElementById("sensibilty").value);
  switch (changeSensibilty) {
    case 1:
      sensibilty = setInterval(loop, 15);
      break
    case 2:
      sensibilty = setInterval(loop, 8);
      break
    case 3:
      sensibilty = setInterval(loop, 5);
  }
}

const times = new Array;
let fps;
function FpsCounter() {
  window.requestAnimationFrame(function() {
  const now = performance.now();
  while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    FpsCounter();
  });
  document.querySelector("h3").innerHTML = "Frame per Second: " + fps
}

document.addEventListener('keydown', function(e) {
  if (e.keyCode == 49) {
    document.getElementById("sensibilty").value = 1;
    document.querySelector("#validateSettings").click()
  }
  if (e.keyCode == 50) {
    document.getElementById("sensibilty").value = 2;
    document.querySelector("#validateSettings").click()
  }
  if (e.keyCode == 51) {
    document.getElementById("sensibilty").value = 3;
    document.querySelector("#validateSettings").click()
  }
})

function ValidateInput() {
  input.value = input.value.toLowerCase();
  try {
    if (input.value == "") throw "Complete blanks";
    if (!input.value.match(/^[A-Za-z]+$/)) throw "Only letters allowed";
    if (input.value.length < 3) throw "Must have at least 3 characters";
  } catch (inputError) {
    alert(inputError);
    return false
  }
  document.querySelector("form").style.display = "none";
  StartGame()

  document.addEventListener('keyup', function(e) {
    if (e.keyCode !== null) { document.documentElement.requestFullscreen() }
  })
}

function StartGame() {
  document.querySelector("div").style.display = "none";
  var stopCountDown = setInterval(CountDown, 1000);
  document.querySelector("#count").style.display = "block";
  document.querySelector("#count").style.animation = "count-down 10s";

  let count = 3;
  function CountDown() {
    document.querySelector("#count").innerHTML = count;
    if (count > 0) { count-- }
    else {
      clearInterval(stopCountDown);
      document.querySelector("#count").style.display = "none"
    }
  }

  setTimeout(function() {
    sensibilty = setInterval(loop, 8);
    document.querySelector("#general").style.display = "block";
    document.querySelector("#name").style.display = "block";
    document.querySelector("#name").innerHTML = "Player: " + "<a style='color:#4dc3ff'> @" + input.value + "</a>";

    let gameScore = function() {
      document.querySelector("#score").innerHTML = "Score: " + score;
      score++
    }

    intervalScore = setInterval(gameScore, 100);
    spaceship.style.display = 'block';
    spaceship.style.animation = "blinkSpaceship 0.2s 5";

    const toogleImages = [
      "Photo/Spaceship1.png",
      "Photo/Spaceship2.png",
      "Photo/Spaceship3.png",
      "Photo/Spaceship4.png",
      "Photo/Spaceship5.png",
      "Photo/Spaceship6.png",
      "Photo/Spaceship7.png"
    ]
    document.body.onkeydown = function(e) {
      if (e.keyCode == 32) {
        hits++;
        spaceship.src = toogleImages[hits % 7]
      }
    }

    function generateFireBallWithAttributes(el, attrs) {
      for (var x in attrs) {
        el.setAttribute(x, attrs[x])
      }
      return el
    }

    (function createFireBalls() {
      for (let i = 0; i < 14; i++) {
        fireball = document.createElement("img");
        fireballArray.push(generateFireBallWithAttributes(fireball, {
          src: "Photo/fireball.png"
        }))
      }
    })()

    fireballArray.forEach((fireballElement) => {
      body.appendChild(fireballElement);
      const fireballMovement = {
        x: fireballRandom(fireballElement.offsetWidth),
        y: 0
      }
      const fireLoop = function() {
        fireballMovement.y += window.innerWidth / 1000 * 2;
        fireballElement.style.top = fireballMovement.y + "px";
        if (fireballMovement.y > window.innerHeight) {
          fireballMovement.x = fireballRandom(fireballElement.offsetWidth);
          fireballElement.style.left = fireballMovement.x + "px";
          fireballMovement.y = 0
        }
      }
      fireballElement.style.left = fireballMovement.x + "px";
      let fireInterval = setInterval(fireLoop, 1000 / (Math.random() * 50 + 80))
    })

    function fireballRandom(x) {
      return Math.floor(Math.random() * (window.innerWidth - x))
    }
  }, 4000)
}

let hits = 0;
let pos = { top: 1000, left: 570 };
const keys = new Object;
window.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true
})
window.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false
})
const loop = function() {
  if (keys[37] || keys[81]) {
    pos.left -= window.innerWidth / 1000 * 4
  }
  if (keys[39] || keys[68]) {
    pos.left += window.innerWidth / 1000 * 4
  }
  if (keys[38] || keys[90]) {
    pos.top -= window.innerWidth / 1000 * 4
  }
  if (keys[40] || keys[83]) {
    pos.top += window.innerWidth / 1000 * 2
  }

  if (pos.left < 0) { pos.left = 0 }
  if (pos.top < 0) { pos.top = 0 }
  if (pos.left + spaceship.offsetWidth >= body.offsetWidth) {
    pos.left = body.offsetWidth - spaceship.offsetWidth
  }
  if (pos.top + spaceship.offsetHeight >= body.offsetHeight) {
    pos.top = body.offsetHeight - spaceship.offsetHeight
  }
  spaceship.style.left = pos.left + "px";
  spaceship.style.top = pos.top + "px";
  checkCollision()
}

function detectOverlap(fireball) {
  const shipRect = spaceship.getBoundingClientRect();
  const fireballRect = fireball.getBoundingClientRect();
  if ((shipRect.x + shipRect.width > fireballRect.x && shipRect.x < fireballRect.x + fireball.width) && (shipRect.y + shipRect.height > fireballRect.y && shipRect.y < fireballRect.y + fireball.height)) {
    return true
  }
}

function checkCollision() {
  let collision = false;
  fireballArray.forEach(function(fireballCollision) {
    if (detectOverlap(fireballCollision)) {
      return collision = true
    }
  })

  if (collision == true) {
    if (input.value == "admin") { return false }
    fireballArray.forEach(function(fireballElement) {
      return fireballElement.style.display = "none"
    })
    stopGame.style.display = "block";
    stopGame.style.animation = "animationStopGame 6.5s forwards";
    clearInterval(intervalScore);
    document.querySelector("#finalScore").style.display = "block";
    document.querySelector("#finalScore").innerHTML = "Your score was: " + score;
    document.querySelector("#finalScore").style.animation = "animationStopGame 6.5s forwards";
    document.querySelector("main").style.display = "none";
    setTimeout(function() { location.reload() }, 5500)
  }
}
