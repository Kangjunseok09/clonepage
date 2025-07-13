const board         = document.getElementById('board');
const gridContainer = document.getElementById('grid-container');
const tileContainer = document.getElementById('tile-container');
const scoreDisplay  = document.getElementById('score');
const bestDisplay   = document.getElementById('best-score');
const newGameBtn    = document.getElementById('new-game');
const msgContainer  = document.getElementById('message-container');
const msgText       = document.getElementById('message-text');
const retryBtn      = document.getElementById('retry');

const SIZE = 4;
const GAP  = 10;
let grid, score, hasWon, cellSize;

function setupGrid() {
  const gc = document.getElementById('grid-container');
  gc.innerHTML = '';
  for (let i = 0; i < SIZE*SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    gc.appendChild(cell);
  }
}

function calcCellSize(){
  const boardSize = board.clientWidth - GAP*2;
  cellSize = (boardSize - GAP*(SIZE-1)) / SIZE;
}

function initGame(){
  grid = Array.from({length:SIZE}, ()=>Array(SIZE).fill(null));
  score = 0; hasWon = false;
  updateScore();
  setupGrid();
  tileContainer.innerHTML = '';
  msgContainer.style.display = 'none';
  calcCellSize();
  addRandomTile();
  addRandomTile();
}

function addRandomTile(){
  const empties = [];
  for(let r=0; r<SIZE; r++) {
    for(let c=0; c<SIZE; c++) {
      if (!grid[r][c]) empties.push({r, c});
    }
  }
  if (empties.length === 0) return;
  const { r, c } = empties[Math.floor(Math.random() * empties.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  const el = document.createElement('div');
  el.className = 'tile';
  el.setAttribute('data-value', value);
  el.textContent = value;
  el.style.width  = `${cellSize}px`;
  el.style.height = `${cellSize}px`;
  el.style.transform = `translate(${c*(cellSize+GAP)}px,${r*(cellSize+GAP)}px)`;
  tileContainer.appendChild(el);

  grid[r][c] = { el, value, row: r, col: c };
}

function slide(line){
  const arr = line.filter(x=>x);
  for(let i=0;i<arr.length-1;i++){
    if(arr[i].value===arr[i+1].value){
      arr[i].value*=2;
      score+=arr[i].value;
      if(arr[i].value===2048) winGame();
      tileContainer.removeChild(arr[i+1].el);
      arr.splice(i+1,1);
    }
  }
  while(arr.length<SIZE) arr.push(null);
  return arr;
}

function move(dir){
  let moved = false;
  const newGrid = Array.from({length:SIZE}, ()=>Array(SIZE).fill(null));

  if(dir==='left'||dir==='right'){
    for(let r=0;r<SIZE;r++){
      let row = grid[r].slice();
      if(dir==='right') row.reverse();
      const merged = slide(row);
      if(dir==='right') merged.reverse();
      for(let c=0;c<SIZE;c++){
        newGrid[r][c] = merged[c];
        if(merged[c]!==grid[r][c]) moved=true;
      }
    }
  } else {
    for(let c=0;c<SIZE;c++){
      let col = grid.map(row=>row[c]);
      if(dir==='down') col.reverse();
      const merged = slide(col);
      if(dir==='down') merged.reverse();
      for(let r=0;r<SIZE;r++){
        newGrid[r][c] = merged[r];
        if(merged[r]!==grid[r][c]) moved=true;
      }
    }
  }
  if(!moved) return;
  grid = newGrid;

  for(let r=0;r<SIZE;r++){
    for(let c=0;c<SIZE;c++){
      const tile = grid[r][c];
      if(tile){
        tile.row = r; tile.col = c;
        tile.value = tile.value;
        tile.el.setAttribute('data-value', tile.value);
        tile.el.textContent = tile.value;
        tile.el.style.transform = `translate(${c*(cellSize+GAP)}px,${r*(cellSize+GAP)}px)`;
      }
    }
  }

  addRandomTile();
  updateScore();
  checkGameOver();
}

// 입력 처리
function handleInput(e){
  if(msgContainer.style.display==='flex') return;
  let dir;
  if(['ArrowLeft','a','ㅁ'].includes(e.key)) dir='left';
  if(['ArrowRight','d','ㅇ'].includes(e.key)) dir='right';
  if(['ArrowUp','w','ㅈ'].includes(e.key)) dir='up';
  if(['ArrowDown','s','ㄴ'].includes(e.key)) dir='down';
  if(dir) move(dir);
}

function checkGameOver(){
  if(hasWon) return;
  for(let r=0;r<SIZE;r++){
    for(let c=0;c<SIZE;c++){
      const t = grid[r][c];
      if(!t) return;
      if(c<SIZE-1 && t.value===grid[r][c+1]?.value) return;
      if(r<SIZE-1 && t.value===grid[r+1][c]?.value) return;
    }
  }
  gameOver();
}

function winGame(){ hasWon=true; showMessage('You Win!'); }
function gameOver(){ showMessage('Game Over'); }
function showMessage(txt){ msgText.textContent=txt; msgContainer.style.display='flex'; }

function updateScore(){
  scoreDisplay.textContent=score;
  const best=parseInt(localStorage.getItem('best')||0,10);
  if(score>best) localStorage.setItem('best',score);
  bestDisplay.textContent=localStorage.getItem('best');
}

window.addEventListener('resize',()=>{ calcCellSize(); });
document.addEventListener('keydown',handleInput);
newGameBtn.addEventListener('click',initGame);
retryBtn.addEventListener('click',initGame);

window.onload=()=>{ calcCellSize(); initGame(); }
