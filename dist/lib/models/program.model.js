"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
var Program = /** @class */ (function () {
    function Program(tvSchedule, title, detail, airTime, startAirTime) {
        this.title = title;
        this.detail = detail;
        this.airTime = airTime;
        this.startAirTime = startAirTime;
        this.tvSchedule = tvSchedule;
    }
    Program.prototype.createProgram = function () {
        return '';
    };
    return Program;
}());
exports.Program = Program;
//# sourceMappingURL=program.model.js.map