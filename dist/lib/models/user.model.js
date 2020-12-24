"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var keyword_model_1 = require("./keyword.model");
var reservation_model_1 = require("./reservation.model");
var User = /** @class */ (function () {
    function User() {
        this.id = 1;
        this.name = 'hisa';
        this.keywords = [];
        this.reservePrograms = [];
    }
    /**
     * keywordがすでに登録されているか確認する
     */
    User.prototype.hasKeyword = function (inputWord) {
        for (var _i = 0, _a = this.keywords; _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.keyword === inputWord)
                return true;
        }
        return false;
    };
    /**
     * 予約されている番組のidを配列にして取得
     */
    User.prototype.createReserveProgramsId = function () {
        var reserveProgramsId = this.reservePrograms.map(function (reserveProgram) {
            return reserveProgram.program.id;
        });
        return reserveProgramsId;
    };
    /**
     * 入力されたwordをkeywordに登録する
     */
    User.prototype.createKeyword = function (inputWord) {
        if (this.hasKeyword(inputWord) === false)
            this.keywords.push(new keyword_model_1.Keyword(this, inputWord));
    };
    /**
     * 入力されたwordをkeywordから削除する
     */
    User.prototype.deleteKeyword = function (inputWord) {
        var words = this.keywords.map(function (key) { return key.keyword; });
        var index = words.indexOf(inputWord);
        if (index >= 0)
            this.keywords.splice(index, 1);
    };
    /**
     * 予約一覧に指定された番組がなければ予約をする
     */
    User.prototype.createReserveProgram = function (program) {
        var reserveProgramsId = this.createReserveProgramsId();
        if (reserveProgramsId.indexOf(program.id) < 0)
            this.reservePrograms.push(new reservation_model_1.Reservation(program, this));
    };
    /**
     * 指定された番組の予約を削除する
     */
    User.prototype.deleteReserveProgram = function (program) {
        var reserveProgramsId = this.createReserveProgramsId();
        var index = reserveProgramsId.indexOf(program.id);
        if (index >= 0)
            this.reservePrograms.splice(index, 1);
    };
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.model.js.map