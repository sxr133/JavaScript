const grid = document.querySelector('.grid')
const resultDisplay = document.querySelector('.results')
let aliensRemoved = []
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let isGoingRight = true
let results = 0

for (let i = 0; i < width * width; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader')
    }
  }
}

draw()

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
  }
}

squares[currentShooterIndex].classList.add('shooter')

function moveShooter(direction) {
  squares[currentShooterIndex].classList.remove('shooter')
  switch (direction) {
    case 'left':
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
      break
    case 'right':
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
      break
  }
  squares[currentShooterIndex].classList.add('shooter')
}

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1

  remove()

  if (rightEdge && isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1
      direction = -1
      isGoingRight = false
    }
  }

  if (leftEdge && !isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1
      direction = 1
      isGoingRight = true
    }
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }

  draw()

  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultDisplay.innerHTML = 'Game Over'
    clearInterval(invadersId)
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squares.length) {
      resultDisplay.innerHTML = 'Game Over'
      clearInterval(invadersId)
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {
    resultDisplay.innerHTML = 'You Win'
    clearInterval(invadersId)
  }
}

invadersId = setInterval(moveInvaders, 500)

function shoot() {
  let laserId
  let currentLaserIndex = currentShooterIndex

  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser')
    currentLaserIndex -= width
    squares[currentLaserIndex].classList.add('laser')

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser')
      squares[currentLaserIndex].classList.remove('invader')
      squares[currentLaserIndex].classList.add('boom')

      setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
      clearInterval(laserId)

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
      aliensRemoved.push(alienRemoved)
      results++
      resultDisplay.innerHTML = results
    }
  }
  laserId = setInterval(moveLaser, 100)
}

// Check if the user is accessing the game from a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

// If it's a mobile device, display the control buttons
if (isMobile) {
  const leftButton = document.createElement('button')
  leftButton.textContent = 'Left'
  leftButton.id = 'left'
  leftButton.addEventListener('click', () => moveShooter('left'))
  document.body.appendChild(leftButton)

  const rightButton = document.createElement('button')
  rightButton.textContent = 'Right'
  rightButton.id = 'right'
  rightButton.addEventListener('click', () => moveShooter('right'))
  document.body.appendChild(rightButton)

  const shootButton = document.createElement('button')
  shootButton.textContent = 'Shoot'
  shootButton.id = 'shoot'
  shootButton.addEventListener('click', shoot)
  document.body.appendChild(shootButton)
} else {
  document.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'ArrowLeft':
        moveShooter('left')
        break
      case 'ArrowRight':
        moveShooter('right')
        break
      case 'ArrowUp':
        shoot()
        break
    }
  })
}
