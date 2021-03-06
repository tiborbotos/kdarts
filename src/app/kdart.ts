export class Player {
  private game: string;
  private maxPoints: number;
  private points: number;
  private dartsCount: number;
  private rounds: Array<Round>;
  private winner: boolean;
  private legsWon: number;
  // handled only in 2 players game
  private matchStarter: boolean;

  constructor(public name: string) {
    this.legsWon = 0;
  }

  private newRound() {
    this.rounds.push(new Round(this.points));
  }

  private lastValidDart() {
    let i = 2;

    while (i >= 0) {
      if (this.getActiveRound().darts[i].getShot() > 0) {
        return this.getActiveRound().darts[i];
      }
      i--;
    }
    return this.getActiveRound().darts[0];
  }

  initialize(game: string) {
    this.game = game;

    this.points = parseInt(game, 10);
    this.maxPoints = parseInt(game, 10);
    this.dartsCount = 0;
    this.rounds = [];
    this.winner = false;
    this.matchStarter = false;

    this.newRound();
  }

  getPoints() {
    return this.points;
  }

  getDartsCount() {
    return this.dartsCount;
  }

  setMatchStarter(matchStarter: boolean) {
    this.matchStarter = matchStarter;
  }

  getAvg() {
    if (this.dartsCount === 0) {
      return '';
    } else {
      let res = ((this.maxPoints - this.points) / this.dartsCount).toString();
      if (res.indexOf('.') > -1) {
        res = res.substring(0, res.indexOf('.') + 2);
      }
      return res;
    }
  }

  getActiveRound() {
    return this.rounds[this.rounds.length - 1];
  }

  getRoundCount() {
    return this.rounds.length;
  }

  getLegsWon() {
    return this.legsWon;
  }

  resetLegsWon() {
    this.legsWon = 0;
  }

  isWinner() {
    return this.winner;
  }

  saveRound(doubleOut: boolean) {
    const activeRoundPoints = this.getActiveRound().getPoints();
    if (doubleOut) {

      if (this.points > activeRoundPoints && (this.points - activeRoundPoints) > 1) {
        this.points -= activeRoundPoints;
      } else if (this.points === activeRoundPoints) {
        if (this.lastValidDart().isDouble() || this.lastValidDart().shot === 50) {
          this.points = 0;
          // setWinner
        } else {
          this.getActiveRound().wasted = true;
        }
      } else {
        this.getActiveRound().wasted = true;
      }
    } else {

      if (this.points >= activeRoundPoints) {
        this.points -= activeRoundPoints;
      } else {
        this.getActiveRound().wasted = true;
      }
    }

    if (this.points > 0) {
      this.newRound();
      this.dartsCount += 1;
    } else {
      this.winner = true;
      this.legsWon += 1;
    }
  }
}

export class DartThrow {
  static validShots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 50];

  public shot = 0;
  private double = false;
  private treble = false;

  constructor() {}

  static isValidShot(shot: string, double: boolean = false, treble: boolean = false) {
    const numberShot = parseInt(shot, 10);
    if (isNaN(numberShot)) {
      return false;
    } else if (treble && (numberShot === 25 || numberShot === 50)) {
      return false;
    } else if (double && (numberShot === 50)) {
      return false;
    } else {
      return DartThrow.validShots.indexOf(numberShot) > -1;
    }
  }

  toggleTreble() {
    this.treble = !this.treble;

    if (this.double) {
      this.double = false;
    }
  }

  toggleDouble() {
    this.double = !this.double;

    if (this.treble) {
      this.treble = false;
    }
  }

  setDouble(double) {
    this.double = double;
  }

  setTreble(treble) {
    this.treble = treble;
  }

  isDouble() {
    return this.double;
  }

  isTreble() {
    return this.treble;
  }

  setShot(shot: number) {
    this.shot = shot;
  }

  getShot() {
    return this.shot;
  }

  addNumber(num: string, isDouble: boolean, isTreble: boolean) {
    const numberShot = parseInt(num, 10);
    if (isNaN(numberShot)) {
      return false;
    } else if ( DartThrow.isValidShot(this.shot.toString() + num, isDouble, isTreble)) {
      this.shot = parseInt(this.shot.toString() + num, 10);
      return true;
    } else {
      return false;
    }
  }

  getPoints() {
    if (this.double) {
      return this.shot * 2;
    } else if (this.treble) {
      return this.shot * 3;
    } else {
      return this.shot;
    }
  }

  getWrittenPoints() {
    if (this.shot === 0) {
      return '-';
    } else if (this.double) {
      return 'D' + this.shot;
    } else if (this.treble) {
      return 'T' + this.shot;
    } else {
      return this.shot.toString();
    }
  }
}

export class Round {
  darts: Array<DartThrow>;
  starterPoints: number;
  throwIndex: number;
  wasted: boolean;

  constructor(points) {
    this.starterPoints = points;
    this.wasted = false;
    this.throwIndex = 0;
    this.darts = [ new DartThrow(), new DartThrow(), new DartThrow()];
  }

  getPoints() {
    return this.darts[0].getPoints() +
      this.darts[1].getPoints() +
      this.darts[2].getPoints();
  }
}

export interface GameConfig {
  game: string;
  legs: number;
  doubleIn: boolean;
  doubleOut: boolean;
  players: Array<Player>;
}
