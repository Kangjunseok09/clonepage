// script.js

const board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best-score");
const newGameBtn = document.getElementById("new-game");

let grid;
let score = 0;

// 게임 시작 / 리셋
function initBoard() {
  // 1) 보드 비우기
  board.innerHTML = "";

  // 2) 그리드 초기화
  grid = Array(4)
    .fill(null)
    .map(() => Array(4).fill(0));

  // 3) 점수 초기화 & 화면 반영
  score = 0;
  updateScore();

  // 4) 새 타일 두 개 추가
  addTile();
  addTile();

  // 5) 보드 렌더링
  updateBoard();
}

// 빈 셀 중 무작위로 2 또는 4 생성
function addTile() {
  const emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) emptyCells.push([r, c]);
    }
  }
  if (emptyCells.length === 0) return;
  const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[r][c] = Math.random() > 0.1 ? 2 : 4;
}

// 그리드 상태를 화면에 그리기
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

// 점수 표시 업데이트
function updateScore() {
  scoreDisplay.textContent = score;
  const best = localStorage.getItem("best") || 0;
  if (score > best) localStorage.setItem("best", score);
  bestDisplay.textContent = localStorage.getItem("best") || 0;
}

// 키 입력 처리
function handleKey(e) {
  let moved = false;
  if (["ArrowLeft", "a", "ㅁ"].includes(e.key)) moved = moveLeft();
  if (["ArrowRight", "d", "ㅇ"].includes(e.key)) moved = moveRight();
  if (["ArrowUp", "w", "ㅈ"].includes(e.key)) moved = moveUp();
  if (["ArrowDown", "s", "ㄴ"].includes(e.key)) moved = moveDown();

  if (moved) {
    addTile();
    updateBoard();
    updateScore();
  }
}

// 한 줄 슬라이드 & 병합 로직
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

// 4방향 이동 함수
function moveLeft() {
  let moved = false;
  for (let r = 0; r < 4; r++) {
    const original = [...grid[r]];
    grid[r] = slide(grid[r]);
    if (original.toString() !== grid[r].toString()) moved = true;
  }
  return moved;
}

function moveRight() {
  let moved = false;
  for (let r = 0; r < 4; r++) {
    const original = [...grid[r]];
    grid[r] = slide(grid[r].reverse()).reverse();
    if (original.toString() !== grid[r].toString()) moved = true;
  }
  return moved;
}

function moveUp() {
  let moved = false;
  for (let c = 0; c < 4; c++) {
    const col = [];
    for (let r = 0; r < 4; r++) col.push(grid[r][c]);
    const original = [...col];
    const newCol = slide(col);
    for (let r = 0; r < 4; r++) grid[r][c] = newCol[r];
    if (original.toString() !== newCol.toString()) moved = true;
  }
  return moved;
}

function moveDown() {
  let moved = false;
  for (let c = 0; c < 4; c++) {
    const col = [];
    for (let r = 0; r < 4; r++) col.push(grid[r][c]);
    const original = [...col];
    const newCol = slide(col.reverse()).reverse();
    for (let r = 0; r < 4; r++) grid[r][c] = newCol[r];
    if (original.toString() !== newCol.toString()) moved = true;
  }
  return moved;
}

// 이벤트 리스너 등록
document.addEventListener("keydown", handleKey);
newGameBtn.addEventListener("click", initBoard);

// 첫 실행
initBoard();