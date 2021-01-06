"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
var Program = /** @class */ (function () {
    function Program(tvSchedule, id, title, detail, airTime, startAirTime, station) {
        this.id = id;
        this.title = title;
        this.detail = detail;
        this.airTime = airTime;
        this.startAirTime = startAirTime;
        this.tvSchedule = tvSchedule;
        this.station = station;
    }
    Program.prototype.toObject = function () {
        return {
            id: this.id,
            station: this.station,
            title: this.title,
            detail: this.detail,
            airTime: this.airTime,
            startAirTime: this.startAirTime
        };
    };
    return Program;
}());
exports.Program = Program;
//# sourceMappingURL=program.model.js.map