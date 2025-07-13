const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best-score");
const newGameBtn = document.getElementById("new-game");

let grid;
let score = 0;

function initBoard() {
  board.innerHTML = "";
  grid = Array(4).fill(null).map(() => Array(4).fill(0));
  addTile();
  addTile();
  updateBoard();
  score = 0;
  updateScore();
}

function addTile() {
  let emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) emptyCells.push([r, c]);
    }
  }
  if (emptyCells.length === 0) return;
  let [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[r][c] = Math.random() > 0.1 ? 2 : 4;
}

function updateBoard() {
  board.innerHTML = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (grid[r][c] !== 0) {
        cell.textContent = grid[r][c];
      }
      board.appendChild(cell);
    }
  }
}

function updateScore() {
  scoreDisplay.textContent = score;
  const best = localStorage.getItem("best") || 0;
  if (score > best) {
    localStorage.setItem("best", score);
  }
  bestDisplay.textContent = localStorage.getItem("best") || 0;
}

document.addEventListener("keydown", handleKey);
newGameBtn.addEventListener("click", initBoard);

function handleKey(e) {
  let moved = false;
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "ㅁ") moved = moveLeft();
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "ㅇ") moved = moveRight();
  if (e.key === "ArrowUp" || e.key === "w" || e.key === "ㅈ") moved = moveUp();
  if (e.key === "ArrowDown" || e.key === "s" || e.key === "ㄴ") moved = moveDown();
  if (moved) {
    addTile();
    updateBoard();
    updateScore();
  } 
}

function slide(row) {
  let arr = row.filter(v => v);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  return arr.filter(v => v).concat(Array(4 - arr.filter(v => v).length).fill(0));
}

function moveLeft() {
  let moved = false;
  for (let r = 0; r < 4; r++) {
    let original = [...grid[r]];
    grid[r] = slide(grid[r]);
    if (original.toString() !== grid[r].toString()) moved = true;
  }
  return moved;
}

function moveRight() {
  let moved = false;
  for (let r = 0; r < 4; r++) {
    let original = [...grid[r]];
    grid[r] = slide(grid[r].reverse()).reverse();
    if (original.toString() !== grid[r].toString()) moved = true;
  }
  return moved;
}

function moveUp() {
  let moved = false;
  for (let c = 0; c < 4; c++) {
    let col = [];
    for (let r = 0; r < 4; r++) col.push(grid[r][c]);
    let original = [...col];
    col = slide(col);
    for (let r = 0; r < 4; r++) grid[r][c] = col[r];
    if (original.toString() !== col.toString()) moved = true;
  }
  return moved;
}

function moveDown() {
  let moved = false;
  for (let c = 0; c < 4; c++) {
    let col = [];
    for (let r = 0; r < 4; r++) col.push(grid[r][c]);
    let original = [...col];
    col = slide(col.reverse()).reverse();
    for (let r = 0; r < 4; r++) grid[r][c] = col[r];
    if (original.toString() !== col.toString()) moved = true;
  }
  return moved;
}

function updateBoard() {
  board.innerHTML = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      const value = grid[r][c];
      if (value !== 0) {
        cell.textContent = value;
        cell.setAttribute("data-value", value); 
      }
      board.appendChild(cell);
    }
  }
}

initBoard();