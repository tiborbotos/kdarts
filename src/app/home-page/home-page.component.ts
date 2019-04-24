import { Component, OnInit } from '@angular/core';
import { GameConfig, Player } from '../kdart';
import { GameManagerService } from '../game-manager.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  phase: number;
  maxPhases: number;
  gameConfig: GameConfig;

  constructor(private gameManager: GameManagerService) {
  }

  ngOnInit() {
    this.phase = 1;
    this.maxPhases = 3;
    this.gameConfig = {
      game: '301',
      legs: 1,
      doubleIn: false,
      doubleOut: false,
      players: [new Player('Player 1'), new Player('Player 2')]
    };

    const previousPlayers = this.gameManager.getPlayers();
    if (previousPlayers &&
      previousPlayers.length > 0) {

      this.gameConfig.players = previousPlayers;
      this.gameConfig.players.forEach((player) => {
        player.resetLegsWon();
      });
    }
  }

  setGame(newGame: string) {
    this.gameConfig.game = newGame;
  }

  playerCount(playerCount: number) {
    this.gameConfig.players = Array.from({length: playerCount}, (v, k) => new Player('Player ' + (k + 1)));
    // new Array(playerCount).map((item, ind) => new Player('Player ' + (ind + 1)));
  }

  goBack() {
    this.phase -= 1;
  }

  showNextPhase() {
    this.phase += 1;

    if (this.phase === 4) {
      this.gameManager.createGame(this.gameConfig);
    }
  }
}
