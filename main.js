const mainContainerWidth = 320;
const mainContainerHeight = 480;

const cellSize = 37;
const cellRow = 8;
const cellCol = 8;

const screenContainerWidth = cellSize * cellRow;
const screenContainerHeight = cellSize * cellCol;

const computerMoveWait = 350; // msec

let mainContainerElement = null;
let screenContainerElement = null;
let statusMessageContainerElement = null;
let enemyConfigMessageContainerElement = null;
let controllerContainerElement = null;

let cellList = [];
let currentTurn = "black";
let isPass = false;
let isGameOver = false;
let isComputerMode = true;

const init = () => {
  mainContainerElement = document.getElementById("main-container");
  mainContainerElement.style.position = "relative";
  mainContainerElement.style.width = mainContainerWidth + "px";
  mainContainerElement.style.height = mainContainerHeight + "px";
  mainContainerElement.style.margin = "5px";
  mainContainerElement.style.fontFamily =
    "'Helvetica Neue',Arial, 'Hiragino Kaku Gothic ProN','Hiragino Sans', Meiryo, sans-serif";
  mainContainerElement.style.backgroundColor = "#f5deb3";
  mainContainerElement.style.border = "2px solid #deb887";
  mainContainerElement.style.boxSizing = "border-box";
  mainContainerElement.style.borderRadius = "5px";
  mainContainerElement.style.display = "flex";
  mainContainerElement.style.alignItems = "center";
  mainContainerElement.style.justifyContent = "center";
  mainContainerElement.style.flexDirection = "column";
  mainContainerElement.style.overflow = "hidden";
  mainContainerElement.style.userSelect = "none";
  mainContainerElement.style.webkitUserSelect = "none";

  screenContainerElement = document.createElement("div");
  screenContainerElement.style.position = "relative";
  screenContainerElement.style.width = screenContainerWidth + "px";
  screenContainerElement.style.height = screenContainerHeight + "px";
  screenContainerElement.style.margin = "10px";
  screenContainerElement.style.display = "flex";
  screenContainerElement.style.alignItems = "center";
  screenContainerElement.style.justifyContent = "center";
  screenContainerElement.style.backgroundColor = "black";
  mainContainerElement.appendChild(screenContainerElement);

  for (let y = 0; y < cellCol; y++) {
    for (let x = 0; x < cellRow; x++) {
      let cellElement = document.createElement("div");
      cellElement.x = x;
      cellElement.y = y;
      cellElement.colorStatus = "none";
      cellElement.style.position = "absolute";
      cellElement.style.width = cellSize + "px";
      cellElement.style.height = cellSize + "px";
      cellElement.style.top = y * cellSize + "px";
      cellElement.style.left = x * cellSize + "px";
      cellElement.style.backgroundColor = "#00ff00";
      cellElement.style.border = "1px solid black";
      cellElement.style.boxSizing = "border-box";
      cellElement.style.display = "flex";
      cellElement.style.alignItems = "center";
      cellElement.style.justifyContent = "center";
      cellElement.style.cursor = "pointer";

      if ((x === 3 && y === 3) || (x === 4 && y === 4)) {
        cellElement.colorStatus = "white";
      }

      if ((x === 3 && y === 4) || (x === 4 && y === 3)) {
        cellElement.colorStatus = "black";
      }

      let pieceElement = document.createElement("div");
      pieceElement.style.position = "absolute";
      pieceElement.style.width = cellSize * 0.85 + "px";
      pieceElement.style.height = cellSize * 0.85 + "px";
      pieceElement.style.border = "1px solid black";
      pieceElement.style.borderRadius = "50%";
      pieceElement.style.boxSizing = "border-box";
      pieceElement.style.display = "none";
      pieceElement.style.alignItems = "center";
      pieceElement.style.justifyContent = "center";
      cellElement.appendChild(pieceElement);

      cellElement.onpointerdown = (e) => {
        e.preventDefault();

        if (e.target.colorStatus !== "none") {
          return;
        }

        isPass = false;

        if (putCell(e.target)) {
          changeTurn();

          if (checkPass()) {
            isPass = true;
            changeTurn();
            if (checkPass()) {
              isGameOver = true;
            }
          }
        }

        showCellList();
        showStatusMessage();

        if (currentTurn === "white" && isComputerMode) {
          computerMove();
        }
      };

      cellList.push(cellElement);
      screenContainerElement.appendChild(cellElement);
    }
  }

  statusMessageContainerElement = document.createElement("div");
  statusMessageContainerElement.style.position = "relative";
  statusMessageContainerElement.style.width = screenContainerWidth + "px";
  statusMessageContainerElement.style.height =
    screenContainerHeight * 0.2 + "px";
  statusMessageContainerElement.style.margin = "2px";
  statusMessageContainerElement.style.padding = "3px";
  statusMessageContainerElement.style.border = "1px solid black";
  statusMessageContainerElement.style.boxSizing = "border-box";
  statusMessageContainerElement.style.fontSize = "16px";
  mainContainerElement.appendChild(statusMessageContainerElement);

  enemyConfigMessageContainerElement = document.createElement("div");
  enemyConfigMessageContainerElement.style.position = "relative";
  enemyConfigMessageContainerElement.style.width = screenContainerWidth + "px";
  enemyConfigMessageContainerElement.style.height =
    screenContainerHeight * 0.1 + "px";
  enemyConfigMessageContainerElement.style.margin = "2px";
  enemyConfigMessageContainerElement.style.padding = "3px";
  enemyConfigMessageContainerElement.style.display = "flex";
  enemyConfigMessageContainerElement.style.alignItems = "flex-end";
  enemyConfigMessageContainerElement.style.fontSize = "16px";
  mainContainerElement.appendChild(enemyConfigMessageContainerElement);

  controllerContainerElement = document.createElement("div");
  controllerContainerElement.style.position = "relative";
  controllerContainerElement.style.width = screenContainerWidth + "px";
  controllerContainerElement.style.height = screenContainerHeight * 0.2 + "px";
  controllerContainerElement.style.margin = "2px";
  controllerContainerElement.style.fontSize = mainContainerWidth * 0.05 + "px";
  controllerContainerElement.style.boxSizing = "border-box";
  controllerContainerElement.style.display = "flex";
  controllerContainerElement.style.alignItems = "center";
  controllerContainerElement.style.justifyContent = "center";
  mainContainerElement.appendChild(controllerContainerElement);

  let vsComputerbuttonElement = document.createElement("div");
  vsComputerbuttonElement.style.position = "relative";
  vsComputerbuttonElement.style.width = screenContainerWidth * 0.6 + "px";
  vsComputerbuttonElement.style.height = screenContainerHeight * 0.15 + "px";
  vsComputerbuttonElement.style.margin = "3px";
  vsComputerbuttonElement.style.fontSize = "15px";
  vsComputerbuttonElement.style.backgroundColor = "#eb6100";
  vsComputerbuttonElement.style.borderBottom = "5px solid #b84c00";
  vsComputerbuttonElement.style.borderRadius = "7px";
  vsComputerbuttonElement.style.backgroundColor = "orange";
  vsComputerbuttonElement.style.boxSizing = "border-box";
  vsComputerbuttonElement.style.cursor = "pointer";
  vsComputerbuttonElement.style.display = "flex";
  vsComputerbuttonElement.style.alignItems = "center";
  vsComputerbuttonElement.style.justifyContent = "center";
  vsComputerbuttonElement.textContent = "人間vsコンピュータ";
  vsComputerbuttonElement.onpointerdown = (e) => {
    isComputerMode = true;
    showEnemyConfigMessage();
  };
  controllerContainerElement.appendChild(vsComputerbuttonElement);

  let vsHumanbuttonElement = vsComputerbuttonElement.cloneNode();
  vsHumanbuttonElement.textContent = "人間vs人間";
  vsHumanbuttonElement.onpointerdown = (e) => {
    isComputerMode = false;
    showEnemyConfigMessage();
  };
  controllerContainerElement.appendChild(vsHumanbuttonElement);

  showStatusMessage();
  showEnemyConfigMessage();
  showCellList();
};

const showCellList = () => {
  cellList.forEach((cell) => {
    if (cell.colorStatus === "black" || cell.colorStatus === "white") {
      cell.firstChild.style.display = "flex";
      cell.firstChild.style.backgroundColor = cell.colorStatus;
    }
  });
};

const showStatusMessage = () => {
  let text = "";

  if (isGameOver) {
    const blackCount = cellList.filter((v) => v.colorStatus === "black").length;
    const whiteCount = cellList.filter((v) => v.colorStatus === "white").length;

    text += "黒：" + blackCount + " ";
    text += "白：" + whiteCount + " ";

    if (blackCount > whiteCount) {
      text += "で、黒の勝ち！！";
    } else if (whiteCount > blackCount) {
      text += "で、白の勝ち！！";
    } else {
      text += "で、引き分け！！";
    }
  } else {
    if (isPass) {
      text += "置けるところがないのでパス。";
    }
    text += (currentTurn === "black" ? "黒" : "白") + "の番です。";
  }
  statusMessageContainerElement.textContent = text;
};

const showEnemyConfigMessage = () => {
  enemyConfigMessageContainerElement.textContent = isComputerMode
    ? "【設定】黒(人間) vs 白(コンピュータ)"
    : "【設定】黒(人間) vs 白(人間)";
};

const checkPass = () => {
  let isPutCell = true;
  cellList.forEach((cell) => {
    if (putCell(getTargetCell(cell.x, cell.y), true)) {
      isPutCell = false;
    }
  });

  return isPutCell;
};

const changeTurn = () => {
  currentTurn === "black" ? (currentTurn = "white") : (currentTurn = "black");
};

const getEnemyTurn = () => {
  return currentTurn === "black" ? "white" : "black";
};

const getTargetCell = (x, y) => {
  if (x < 0 || y < 0 || x > cellRow - 1 || y > cellCol - 1) {
    return false;
  } else {
    return cellList
      .filter((v) => {
        return v.x === x && v.y === y;
      })
      .shift();
  }
};

const putCell = (startCell, isDryRun = false) => {
  if (startCell.colorStatus !== "none") {
    return false;
  }

  let isPutCell = false;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      let cx = startCell.x + dx;
      let cy = startCell.y + dy;
      let enemyCellCount = 0;

      while (
        getTargetCell(cx, cy) !== false &&
        getTargetCell(cx, cy).colorStatus === getEnemyTurn()
      ) {
        cx += dx;
        cy += dy;
        enemyCellCount++;
      }

      if (
        getTargetCell(cx, cy) !== false &&
        getTargetCell(cx, cy).colorStatus === currentTurn &&
        enemyCellCount > 0
      ) {
        isPutCell = true;

        if (isDryRun === false) {
          startCell.colorStatus = currentTurn;

          cx = startCell.x + dx;
          cy = startCell.y + dy;

          while (
            getTargetCell(cx, cy) !== false &&
            getTargetCell(cx, cy).colorStatus === getEnemyTurn()
          ) {
            getTargetCell(cx, cy).colorStatus = currentTurn;
            cx += dx;
            cy += dy;
          }
        }
      }
    }
  }

  return isPutCell;
};

const computerMove = async () => {
  await new Promise((r) => setTimeout(r, computerMoveWait));

  const putOptions = cellList.filter((cell) =>
    putCell(getTargetCell(cell.x, cell.y), true)
  );

  const targetCell = putOptions[Math.floor(Math.random() * putOptions.length)];
  putCell(targetCell);

  changeTurn();
  if (checkPass()) {
    isPass = true;
    computerMove();
    changeTurn();
    if (checkPass()) {
      isGameOver = true;
    }
  }

  showCellList();
  showStatusMessage();
};

window.onload = () => {
  init();
};
