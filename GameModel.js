class GameModel {
  constructor() {
    // this.model = new Map();
    // this.currentGame = 1;
    // this.currentPlayers = [];
    this.playerX = null;
    this.playerO = null;
    this.game = [];

    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push(null);
      }
      this.game.push(row);
    }
  }

  //   addPlayer(id) {
  //     if ()
  //     this.model.set(id, this.currentGame);
  //     this.currentPlayers.push(id);

  //     // When the current game is full, initialize next
  //     if (this.currentPlayers.length == 2) {
  //       this.currentPlayers = [];
  //       this.currentGame += 1;
  //     }

  //     return this.model.get(id);
  //   }

  // Supporting only one game
  addPlayerSingleGame(id) {
    if ([this.playerO, this.playerX].includes(id)) {
      return 1; //"You are already in the game"
    }
    if (this.playerO != null && this.playerX != null) {
      return 0; //"Game full, you cannot be added";
    }
    if (this.playerX == null) {
      this.playerX = id;
      return "X";
    }
    this.playerO = id;
    return "O"; //"You are added in the game now";
  }

  removePlayerSingleGame(id) {
    if (this.playerO == id) {
      this.playerO = null;
    } else if (this.playerX == id) {
      this.playerX = null;
    }
  }

  playTurn(player, row, col) {
    this.game[row][col] = player;
    if (this.evaluate() === true) {
      return 0; // Game Over
    }
    return 1;
  }

  evaluate() {
    for (let i = 0; i < 3; i++) {
      if (this.evalRow(i) === true) {
        return true;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (this.evalCol(i) === true) {
        return true;
      }
    }
    return this.evalDiagonal1() || this.evalDiagonal2();
  }

  evalRow(rowNum) {
    for (let j = 0; j < 3 - 1; j++) {
      if (
        this.game[rowNum][j] == null ||
        this.game[rowNum][j] !== this.game[rowNum][j + 1]
      ) {
        return false;
      }
    }
    return true;
  }

  evalCol(colNum) {
    for (let i = 0; i < 3 - 1; i++) {
      if (
        this.game[i][colNum] == null ||
        this.game[i][colNum] !== this.game[i + 1][colNum]
      ) {
        return false;
      }
    }
    return true;
  }

  evalDiagonal1() {
    for (let i = 0; i < 3 - 1; i++) {
      if (
        this.game[i][i] == null ||
        this.game[i][i] !== this.game[i + 1][i + 1]
      ) {
        return false;
      }
    }
    return true;
  }

  evalDiagonal2() {
    let j = 3;
    for (let i = 0; i < 3 - 1; i++) {
      j -= 1;
      if (
        this.game[i][j] == null ||
        this.game[i][j] !== this.game[i + 1][j - 1]
      ) {
        return false;
      }
    }

    return true;
  }
}

module.exports = GameModel;
