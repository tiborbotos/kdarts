import { Component, OnInit } from '@angular/core';
import { Player } from '../kdart';
import { GameManagerService } from '../game-manager.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { OutChartService } from '../out-chart.service';

@Component({
  selector: 'app-x01game-page',
  templateUrl: './x01game-page.component.html',
  styleUrls: ['./x01game-page.component.scss']
})
export class X01gamePageComponent implements OnInit {

  players: Array<Player>;

  constructor(private gameManager: GameManagerService,
              private outChart: OutChartService) {
    this.players = gameManager.getPlayers();
    this.players[0].setMatchStarter(true);
  }

  ngOnInit() {
  }

  getAvgPoints(player: Player) {
    return player.getAvg();
  }

  getLegsWon(player: Player) {
    return player.getLegsWon();
  }

  isLegCounterVisible() {
    return this.gameManager.getLegs() > 1;
  }

  getPlayerIndex() {
    return this.gameManager.getPlayerIndex();
  }

  setPlayerIndex(value: number) {
    this.gameManager.setPlayerIndex(value);
  }

  getCurrentPlayer() {
    return this.players[this.getPlayerIndex()];
  }

  getCurrentRound() {
    return this.getCurrentPlayer().getActiveRound();
  }

  getWrittenPoints(index: number) {
    return this.getCurrentRound().darts[index].getWrittenPoints();
  }

  getThrowIndex() {
    return this.getCurrentRound().throwIndex;
  }

  setThrowIndex(index: number) {
    this.getCurrentRound().throwIndex = index;
  }

  getPointsWithActiveRound(player: Player) {
    if (this.getCurrentPlayer() === player) {
      return player.getPoints() - player.getActiveRound().getPoints();
    } else {
      return player.getPoints();
    }
  }

  getOutChart(player: Player) {
    let bestOutDarts = this.outChart.getOutFor(player.getPoints());
    let failedOutAttempt = false;

    if (this.getCurrentPlayer() === player && !!bestOutDarts) {
      let i = 0;
      const checkDartsIndex = this.getThrowIndex() < 2 ? this.getThrowIndex() : 3;

      while (i < checkDartsIndex) {
        if (this.getCurrentRound().darts[i].getWrittenPoints() !== bestOutDarts[i] &&
          (i !== 2 && this.getCurrentRound().darts[i].getPoints() !== 0 )) {
          failedOutAttempt = true;
        }
        i++;
      }

      if (failedOutAttempt) {
        console.log('Failed out attempt');
        bestOutDarts = this.outChart.getOutFor(this.getPointsWithActiveRound(player));
        if (!!bestOutDarts && (2 - this.getThrowIndex()) >= bestOutDarts.length) {
          failedOutAttempt = false;
        }
      }
    }
    return {
      darts: bestOutDarts,
      failedOutAttempt,
    };
  }

  saveRound() {
    console.log('Saveround');
    const currentPlayer = this.getCurrentPlayer();

    currentPlayer.saveRound(this.gameManager.isDoubleOut());

    if (currentPlayer.getPoints() === 0) {
      this.gameManager.setWinner(this.getCurrentPlayer());
    } else {
      if (this.getPlayerIndex() === this.players.length - 1) { // next round
        this.setPlayerIndex(0);
      } else { // next player
        this.setPlayerIndex(this.getPlayerIndex() + 1);
      }
    }
  }
}
