"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
var Reservation = /** @class */ (function () {
    function Reservation(program, user) {
        this.id = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
        this.program = program;
        this.user = user;
    }
    Reservation.prototype.toObject = function () {
        return {
            id: this.id,
            program: this.program.id,
            user_id: this.user.id
        };
    };
    return Reservation;
}());
exports.Reservation = Reservation;
//# sourceMappingURL=reservation.model.js.map