import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DartThrow, Round } from '../kdart';

@Component({
  selector: 'app-dart-keyboard',
  templateUrl: './dart-keyboard.component.html',
  styleUrls: ['./dart-keyboard.component.scss']
})
export class DartKeyboardComponent implements OnInit {

  @Input()
  round: Round;

  @Output()
  onSave = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  private initialize() {
    // angular.element(document.body).bind('keydown', (event: JQueryKeyEventObject) => {
    //   this.log(event.which);
    //
    //   if (event.which === 116 || event.which === 84) {
    //     this.toggleTreble();
    //     scope.$apply();
    //   } else if (event.which === 100 || event.which === 68) {
    //     this.toggleDouble();
    //     scope.$apply();
    //   } else if (event.which >= 48 && event.which <= 57) {
    //     this.record(event.which - 48);
    //     scope.$apply();
    //   } else if (event.which === 32 || event.which === 13 || event.which === 188 || event.which === 39) { // space, enter, comma, cursor move right
    //     if (this.isLastDart() && event.which === 13) {
    //       this.saveDarts();
    //     } else {
    //       this.nextDart();
    //     }
    //     scope.$apply();
    //   } else if (event.which === 37) { // cursor move left
    //     if (!this.isFirstDart()) {
    //       this.previousDart();
    //       scope.$apply();
    //     }
    //   } else if (event.which === 8) {
    //     this.deleteNumber();
    //     if (this.getCurrentThrow().getShot() === 0) {
    //       this.previousDart();
    //     }
    //     event.preventDefault();
    //     scope.$apply();
    //   }
    // });
  }

  private getCurrentThrow() {
    return this.round.darts[this.round.throwIndex];
  }

  toggleTreble() {
    this.getCurrentThrow().toggleTreble();

    this.log('Toggle treble: ' + this.getCurrentThrow().getShot() + ' = ' + this.getCurrentThrow().getPoints());
  }

  toggleDouble() {
    this.getCurrentThrow().toggleDouble();

    this.log('Toggle double: ' + this.getCurrentThrow().getShot() + ' = ' + this.getCurrentThrow().getPoints());
  }

  invalidNumber(num) {
    return !DartThrow.isValidShot(this.getCurrentThrow().getShot() + num.toString(),
      this.getCurrentThrow().isDouble(),
      this.getCurrentThrow().isTreble());
  }

  isTrebleDisabled() {
    return this.getCurrentThrow().getShot() === 25 || this.getCurrentThrow().getShot() === 50;
  }

  isDoubleDisabled() {
    return this.getCurrentThrow().getShot() === 50;
  }

  record(num) {
    this.getCurrentThrow().addNumber(num.toString(), this.getCurrentThrow().isDouble(),
      this.getCurrentThrow().isTreble());
  }

  deleteNumber() {
    if (this.getCurrentThrow().getShot() > 0) {
      let shot = this.getCurrentThrow().getShot().toString();
      shot = shot.substring(0, shot.length - 1);
      if (shot.length === 0) {
        shot = '0';
      }
      this.getCurrentThrow().setShot(parseInt(shot, 10));
    }
  }

  clear() {
    this.getCurrentThrow().setDouble(false);
    this.getCurrentThrow().setTreble(false);
    this.getCurrentThrow().setShot(0);
  }

  isFirstDart() {
    return this.round.throwIndex === 0;
  }

  isLastDart() {
    return this.round.throwIndex === 2;
  }

  nextDart() {
    this.log('nextDart ' + this.round.throwIndex);
    if (this.round.throwIndex < 2) {
      this.round.throwIndex += 1;
    }
  }

  previousDart() {
    if (this.round.throwIndex > 0) {
      this.round.throwIndex -= 1;
    }
  }

  saveDarts() {
    this.log('saveDarts ');
    this.onSave.emit();
  }

  private log(input) {
    console.log(input);
  }
}
