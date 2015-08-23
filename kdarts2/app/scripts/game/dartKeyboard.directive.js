/// <reference path="../references.d.ts" />
/// <reference path="../kdarts.ts" />
/// <reference path="../base/base.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var kdarts;
(function (kdarts) {
    var game;
    (function (game) {
        var DartKeyboard = (function (_super) {
            __extends(DartKeyboard, _super);
            function DartKeyboard() {
                _super.call(this, DartKeyboard, DartKeyboard.prototype.initialize);
                this.templateUrl = 'scripts/game/dartKeyboard.html';
                this.scope = {
                    round: '=',
                    onSave: '&'
                };
            }
            DartKeyboard.Factory = function () {
                var directive = function () {
                    return new DartKeyboard();
                };
                directive['$inject'] = [];
                return directive;
            };
            DartKeyboard.prototype.initialize = function () {
            };
            DartKeyboard.prototype.getCurrentThrow = function () {
                return this.$scope.round.darts[this.$scope.round.throwIndex];
            };
            DartKeyboard.prototype.toggleTreble = function () {
                this.getCurrentThrow().toggleTreble();
                console.log('Shot: ', this.getCurrentThrow().getShot() + ' = ' + this.getCurrentThrow().getPoints());
            };
            DartKeyboard.prototype.toggleDouble = function () {
                this.getCurrentThrow().toggleDouble();
                console.log('Shot: ', this.getCurrentThrow().getShot() + ' = ' + this.getCurrentThrow().getPoints());
            };
            DartKeyboard.prototype.invalidNumber = function (num) {
                return !kdarts.DartThrow.isValidShot(this.getCurrentThrow().getShot() + num.toString(), this.getCurrentThrow().isDouble(), this.getCurrentThrow().isTreble());
            };
            DartKeyboard.prototype.isTrebleDisabled = function () {
                return this.getCurrentThrow().getShot() === 25 || this.getCurrentThrow().getShot() === 50;
            };
            DartKeyboard.prototype.isDoubleDisabled = function () {
                return this.getCurrentThrow().getShot() === 50;
            };
            DartKeyboard.prototype.record = function (num) {
                this.getCurrentThrow().addNumber(num.toString());
                console.log('Shot: ', this.getCurrentThrow().getShot() + ' = ' + this.getCurrentThrow().getPoints());
            };
            DartKeyboard.prototype.deleteNumber = function () {
                if (this.getCurrentThrow().getShot() > 0) {
                    var shot = this.getCurrentThrow().getShot().toString();
                    shot = shot.substring(0, shot.length - 1);
                    if (shot.length === 0) {
                        shot = '0';
                    }
                    this.getCurrentThrow().setShot(parseInt(shot));
                }
                console.log('Shot: ', this.getCurrentThrow().getShot() + ' = ' + this.getCurrentThrow().getPoints());
            };
            DartKeyboard.prototype.clear = function () {
                this.getCurrentThrow().setDouble(false);
                this.getCurrentThrow().setTreble(false);
                this.getCurrentThrow().setShot(0);
            };
            DartKeyboard.prototype.isFirstDart = function () {
                return this.$scope.round.throwIndex === 0;
            };
            DartKeyboard.prototype.isLastDart = function () {
                return this.$scope.round.throwIndex === 2;
            };
            DartKeyboard.prototype.nextDart = function () {
                if (this.$scope.round.throwIndex < 2) {
                    this.$scope.round.throwIndex += 1;
                }
            };
            DartKeyboard.prototype.previousDart = function () {
                if (this.$scope.round.throwIndex > 0) {
                    this.$scope.round.throwIndex -= 1;
                }
            };
            DartKeyboard.prototype.saveDarts = function () {
                this.$scope.onSave();
            };
            return DartKeyboard;
        })(kdarts.base.Directive);
        angular
            .module('kdarts.game')
            .directive('dartKeyboard', DartKeyboard.Factory());
    })(game = kdarts.game || (kdarts.game = {}));
})(kdarts || (kdarts = {}));
//# sourceMappingURL=dartKeyboard.directive.js.map