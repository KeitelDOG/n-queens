function Board(n) {
  this.solutionCount = 0;
  this.board = [];
  this.solutions = [];
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      row.push(0);
    }
    this.board.push(row);
  }
}

Board.prototype.animate = function() {
  let that = this;
  let interval = 50;
  let promise = Promise.resolve();
  let solCount = 0;

  let total = document.getElementById('total');
  total.innerHTML = that.solutionCount;

  //that.show(this.solutions[10].bd, this.solutions[10].isSol);

  that.solutions.forEach(function (sol, ind) {
    promise = promise.then(function () {
      if (that.solutionCount > 0 && solCount === that.solutionCount) {
        return;
      }

      that.show(sol.bd, sol.isSol);
      let wait = 1;
      if (sol.isSol) {
        solCount++;
        wait = 20;
      }

      return new Promise(function (resolve) {
        setTimeout(resolve, interval * wait);
      });
    });
  });

  promise.then(function () {
    console.log('solution animation finished');
  });
}

Board.prototype.show = function(bd = null, isSolution = false) {
  let table = document.getElementById('data-table');
  let counter = document.getElementById('counter');
  let svgQueen = document.getElementById('svg-queen');
  table.innerHTML = '';

  if (isSolution) {
    counter.innerHTML = Number(counter.innerHTML) + 1;
  }

  bd = bd || this.clone();
  //console.log('display', bd);

  bd.forEach(row => {
    var tRow = table.insertRow();

    row.forEach(col => {
      var cell = tRow.insertCell();
      if (col === 1) {
        let svg = svgQueen.cloneNode(true);
        svg.setAttribute('id', null);
        svg.style.display = 'block';

        if (isSolution) {
          svg.style.stroke = 'green';
        }
        cell.append(svg);

      } else if (col === 2) {
        let svg = svgQueen.cloneNode(true);
        svg.setAttribute('id', null);
        svg.style.display = 'block';
        svg.style.stroke = 'ccc';
        cell.append(svg);
      }
    });
  });
}

Board.prototype.clone = function() {
  let board = [];
  for (let i = 0; i < this.board.length; i++) {
    let row = [];
    for (let j = 0; j < this.board.length; j++) {
      row.push(this.board[i][j]);
    }
    board.push(row);
  }
  return board;
}

Board.prototype.start = function() {
  // place a queen at 0,0 with toggle
  //this.toggle(0, 2);
  this.permutate(0, 0);

  // place a queen at 0,1 and check if conflicts exist
  // repeat resursively with a updated board
}

Board.prototype.permutate = function(row = 0) {
  //console.log('checking row', row);
  let that = this;

  // count as solution if it's the last line
  if (row === this.board.length) {
    //console.log('match -----------------');
    let bd = this.clone();
    //console.log(bd);
    this.solutions.push({ isSol: true, bd });
    this.solutionCount++;
    return;
  }

  for (let col = 0; col < this.board.length; col++) {
    this.mark(row, col, 2);
    let bd = this.clone();
    this.solutions.push({ isSol: false, bd });

    if (!this.hasConflict(row, col)) {
      //console.log('no conflict');
      this.mark(row, col);
      this.permutate(row + 1);
      this.unMark(row, col);
    }

    this.unMark(row, col, 2);
    //bd = this.clone();
    //this.solutions.push({ isSol: false, bd });
  }

  if (row === 0) {
    //console.log('end -----------------', this.solutions.length);
    this.animate();
  }
}

Board.prototype.toggle = function(row, col, check = false) {
  if (this.board[row][col] === 0) {
    if (check === true) {
      this.board[row][col] = 2;
    } else {
      this.board[row][col] = 1;
    }

  } else {
    this.board[row][col] = 0;
  }
}

Board.prototype.mark = function(row, col, num = 1) {
  this.board[row][col] = num;
}

Board.prototype.unMark = function(row, col, num = 1) {
  if (this.board[row][col] === num) {
    this.board[row][col] = 0;
  }
}

Board.prototype.hasConflict = function(row, col) {
  return (
    this.hasHorizontalConflict(row) ||
    this.hasVerticalConflict(col) ||
    this.hasMinorDiagonalConflict(row, col) ||
    this.hasMajorDiagonalConflict(row, col)
  );
}

Board.prototype.hasVerticalConflict = function(col) {
  for (let row = 0; row < this.board.length; row++) {
    if (this.board[row][col] === 1) {
      return true;
    }
  }
  //console.log('no vertical conflict', col);
  return false;
}

Board.prototype.hasHorizontalConflict = function(row) {
  for (let col = 0; col < this.board.length; col++) {
    if (this.board[row][col] === 1) {
      return true;
    }
  }
  //console.log('no horizontal conflict', row);
  return false;
}

Board.prototype.hasMinorDiagonalConflict = function(row, col) {
  // matrix calculation : row + col
  // all the same value indicate a minor diagonal alignment
  /*
   0  1  2  3
   1  2  3  4
   2  3  4  5
   3  4  5  6
  */

  // Check if board contains any marked value 1 at the same value in matrix
  for (let i = 0; i < this.board.length; i++) {
    for (let j = 0; j < this.board.length; j++) {
      if (this.board[i][j] === 1 && i + j === row + col) {
        return true;
      }
    }
  }

  //console.log('no minor diagonal conflict', row, col);
  return false;
}

Board.prototype.hasMajorDiagonalConflict = function(row, col) {
  // matrix calculation : col - row
  // all the same value indicate a major diagonal alignment
  /*
   0  1  2  3
  -1  0  1  2
  -2 -1  0  1
  -3 -2 -1  0
  */

  // Check if board contains any marked value 1 at the same value in matrix
  for (let i = 0; i < this.board.length; i++) {
    for (let j = 0; j < this.board.length; j++) {
      if (this.board[i][j] === 1 && j - i === col - row) {
        return true;
      }
    }
  }

  //console.log('no major diagonal conflict', row, col);
  return false;
}



// LAUNCH HERE
const board = new Board(8);
board.start();
//board.mark(1, 0, 1);
//console.log('major diag confct', board.hasMajorDiagonalConflict(2, 2));
//console.log('vert confct', board.hasVerticalConflict(0));