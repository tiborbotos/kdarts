/// <reference path="../references.d.ts" />
/// <reference path="../kdarts.ts" />
/// <reference path="../base/base.ts" />

module kdarts.game {


    interface DartKeyboardScope extends kdarts.base.Scope<DartKeyboardScope> {
        round: kdarts.Round;
        onSave();
    }

    class DartKeyboard extends kdarts.base.Directive<DartKeyboardScope> {
        public templateUrl = 'scripts/game/dartKeyboard.html';
        public scope = {
            round: '=',
            onSave: '&'
        };

        constructor() {
            super(DartKeyboard, DartKeyboard.prototype.initialize);
        }

        static Factory() {
            var directive = () => {
                return new DartKeyboard();
            };
            directive['$inject'] = [];
            return directive;
        }

        private initialize() {
        }

        private getCurrentThrow() {
            return this.$scope.round.darts[this.$scope.round.throwIndex];
        }

        toggleTreble() {
            this.getCurrentThrow().toggleTreble();

            console.log('Shot: ', this.getCurrentThrow().getShot() + ' = ' + this.getCurrentThrow().getPoints());
        }

        toggleDouble() {
            this.getCurrentThrow().toggleDouble();

            console.log('Shot: ', this.getCurrentThrow().getShot() + ' = ' + this.getCurrentThrow().getPoints());
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
            this.getCurrentThrow().addNumber(num.toString());

            console.log('Shot: ', this.getCurrentThrow().getShot() + ' = ' + this.getCurrentThrow().getPoints());
        }

        deleteNumber() {
            if (this.getCurrentThrow().getShot() > 0) {
                var shot = this.getCurrentThrow().getShot().toString();
                shot = shot.substring(0, shot.length - 1);
                if (shot.length === 0) {
                    shot = '0';
                }
                this.getCurrentThrow().setShot(parseInt(shot));
            }

            console.log('Shot: ', this.getCurrentThrow().getShot() + ' = ' + this.getCurrentThrow().getPoints());
        }

        clear() {
            this.getCurrentThrow().setDouble(false);
            this.getCurrentThrow().setTreble(false);
            this.getCurrentThrow().setShot(0);
        }

        isFirstDart() {
            return this.$scope.round.throwIndex === 0;
        }

        isLastDart() {
            return this.$scope.round.throwIndex === 2;
        }

        nextDart() {
            if (this.$scope.round.throwIndex < 2) {
                this.$scope.round.throwIndex += 1;
            }
        }

        previousDart() {
            if (this.$scope.round.throwIndex > 0) {
                this.$scope.round.throwIndex -= 1;
            }
        }

        saveDarts() {
            this.$scope.onSave();
        }
    }

    angular
        .module('kdarts.game')
        .directive('dartKeyboard', DartKeyboard.Factory());

}
