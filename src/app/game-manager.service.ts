import { Injectable } from '@angular/core';
import { GameConfig, Player } from './kdart';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  private gameConfig: GameConfig;
  private currentLeg: number;
  private legs: number;
  private playerIndex: number;
  private previousMatchStarterPlayerIndex: number;

  constructor(private router: Router,
              private dialog: MatDialog) { }


  getPlayers() {
    if (isUndefined(this.gameConfig)) {
      return undefined;
    }
    return this.gameConfig.players;
  }

  isDoubleOut() {
    return this.gameConfig.doubleOut;
  }

  getCurrentLeg() {
    return this.currentLeg;
  }

  getLegs() {
    return this.gameConfig.legs;
  }

  createGame(config: GameConfig) {
    this.gameConfig = config;
    this.currentLeg = 0;
    this.previousMatchStarterPlayerIndex = 0;
    this.setPlayerIndex(0);

    this.nextLeg();
    this.router.navigate(['/x01game']);
  }

  nextLeg() {
    this.currentLeg += 1;

    this.gameConfig.players.forEach((player: Player) => {
      player.initialize(this.gameConfig.game);
    });
  }

  getPlayerIndex() {
    return this.playerIndex;
  }

  setPlayerIndex(value: number) {
    this.playerIndex = value;
  }

  resetGame() {
    this.currentLeg = 0;
    this.previousMatchStarterPlayerIndex = 0;
    this.gameConfig.players.forEach((player: Player) => {
      player.resetLegsWon();
    });

    this.setPlayerIndex(0);
    this.nextLeg();
    this.router.navigate(['x01game']);
  }

  setWinner(player: Player) {
    // TODO
    // this.dialog.show(
    //   this.dialog
    //     .alert()
    //     .title('Winner!')
    //     .content(player.name + ' won!')
    //     .ok('OK')
    // ).then(() => {
    //   if (this.getCurrentLeg() < this.getLegs()) {
    //     this.nextLeg();
    //
    //     if (this.getPlayers().length === 2) {
    //       this.setPlayerIndex(this.previousMatchStarterPlayerIndex === 0 ? 1 : 0);
    //       this.previousMatchStarterPlayerIndex = this.getPlayerIndex();
    //
    //       this.getPlayers()[this.getPlayerIndex()].setMatchStarter(true);
    //     } else {
    //       this.setPlayerIndex(0);
    //     }
    //   } else {
    //     this.$mdDialog.show(
    //       this.$mdDialog
    //         .confirm()
    //         .title('Replay?')
    //         .content('Would you like a replay?')
    //         .ok('Yes')
    //         .cancel('No')
    //     ).then((res) => {
    //       this.resetGame();
    //     }).catch(() => {
    //       this.$state.go('home');
    //     });
    //   }
    // });
  }
}
