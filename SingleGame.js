export const AddPlayerStatus = {
  CannotBeAdded: 0,
  AlreadyInGame: 1,
  PlayerX: "X",
  PlayerO: "O",
};

export class SingleGame {
  constructor() {
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

  /**
   * @returns {AddPlayerStatus}
   */
  addPlayer(id) {
    if ([this.playerO, this.playerX].includes(id)) {
      return AddPlayerStatus.AlreadyInGame;
    }
    if (this.playerO != null && this.playerX != null) {
      return AddPlayerStatus.CannotBeAdded;
    }
    if (this.playerX == null) {
      this.playerX = id;
      return AddPlayerStatus.PlayerX;
    }
    this.playerO = id;
    return AddPlayerStatus.PlayerO;
  }

  removePlayer(id) {
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
