const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const width = 10;
let squares = [];
let currentPosition = 4;
let currentRotation = 0;
let score = 0;

// Tetromino shapes
const lTetromino = [
  [1, width+1, width*2+1, 2],
  [width, width+1, width+2, width*2+2],
  [1, width+1, width*2+1, width*2],
  [width, width*2, width*2+1, width*2+2]
];

const zTetromino = [
  [0, width, width+1, width*2+1],
  [width+1, width+2, width*2, width*2+1],
  [0, width, width+1, width*2+1],
  [width+1, width+2, width*2, width*2+1]
];

const tTetromino = [
  [1, width, width+1, width+2],
  [1, width+1, width+2, width*2+1],
  [width, width+1, width+2, width*2+1],
  [1, width, width+1, width*2+1]
];

const oTetromino = [
  [0, 1, width, width+1],
  [0, 1, width, width+1],
  [0, 1, width, width+1],
  [0, 1, width, width+1]
];

const iTetromino = [
  [1, width+1, width*2+1, width*3+1],
  [width, width+1, width+2, width+3],
  [1, width+1, width*2+1, width*3+1],
  [width, width+1, width+2, width+3]
];

const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

let random = Math.floor(Math.random() * tetrominoes.length);
let current = tetrominoes[random][currentRotation];

// Create grid
function createGrid() {
  for (let i = 0; i < 200; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
    squares.push(square);
  }

  for (let i = 0; i < 10; i++) {
    const square = document.createElement('div');
    square.classList.add('taken');
    grid.appendChild(square);
    squares.push(square);
  }
}
createGrid();

// Draw the tetromino
function draw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.add('active');
  });
}

// Undraw the tetromino
function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove('active');
  });
}

// Move down function
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

// Freeze function
function freeze() {
  if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
    current.forEach(index => squares[currentPosition + index].classList.add('taken'));
    // Start a new tetromino
    random = Math.floor(Math.random() * tetrominoes.length);
    current = tetrominoes[random][currentRotation];
    currentPosition = 4;
    draw();
    addScore();
  }
}

// Move the tetromino left
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
  if (!isAtLeftEdge) currentPosition -= 1;
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition += 1;
  }
  draw();
}

// Move the tetromino right
function moveRight() {
  undraw();
  const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
  if (!isAtRightEdge) currentPosition += 1;
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -= 1;
  }
  draw();
}

// Add score
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = Array.from({ length: width }, (_, idx) => i + idx);
    if (row.every(index => squares[index].classList.contains('taken'))) {
      score += 10;
      scoreDisplay.textContent = score;
      row.forEach(index => {
        squares[index].classList.remove('taken', 'active');
      });
      const removedSquares = squares.splice(i, width);
      squares = removedSquares.concat(squares);
      squares.forEach(cell => grid.appendChild(cell));
    }
  }
}

// Control the game
function control(e) {
  if (e.keyCode === 37) moveLeft();
  else if (e.keyCode === 38) rotate();
  else if (e.keyCode === 39) moveRight();
  else if (e.keyCode === 40) moveDown();
}

document.addEventListener('keyup', control);

// Rotate tetromino
function rotate() {
  undraw();
  currentRotation = (currentRotation + 1) % 4;
  current = tetrominoes[random][currentRotation];
  draw();
}

// Start game
draw();
setInterval(moveDown, 1000);
