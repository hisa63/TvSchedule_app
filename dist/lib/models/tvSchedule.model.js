"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvSchedule = void 0;
var program_model_1 = require("./program.model");
var station_model_1 = require("./station.model");
var TvSchedule = /** @class */ (function () {
    function TvSchedule(scheduleCollect, date, scheduleData) {
        this.startProgramTime = 5;
        this.date = date;
        this.scheduleCollect = scheduleCollect;
        this.scheduleData = scheduleData;
        this.programs = [];
    }
    TvSchedule.prototype.createOneMinHeight = function (epgTime) {
        var minHeight = (Math.round(Number(epgTime.attributes.style.match(/(?<=height:).*(?=px;)/)) / 1440 * 10) / 10);
        return minHeight;
    };
    TvSchedule.prototype.calculateAirTime = function (program, minHeight) {
        var programHeight = program.attributes.style.match(/(?<=height:).*(?=px;left)/);
        var airTime = Math.round(Number(programHeight) / minHeight);
        return airTime;
    };
    TvSchedule.prototype.calculateStartAirTime = function (program, minHeight) {
        var startProgramHeight = program.attributes.style.match(/(?<=top:).*(?=px)/);
        var aboutStartTime = this.startProgramTime + Math.round(Number(startProgramHeight) / minHeight) / 60;
        var startAirTime = Math.floor(aboutStartTime) + Math.round(aboutStartTime % Math.floor(aboutStartTime) * .6 * 100) / 100;
        return startAirTime;
    };
    TvSchedule.prototype.createProgramTitle = function (program) {
        var title = program.querySelector('.title').text;
        return title;
    };
    TvSchedule.prototype.createProgramDetail = function (program) {
        var detail = program.querySelector('p').text;
        return detail;
    };
    TvSchedule.prototype.createStation = function (allStation) {
        var stationName = [];
        for (var _i = 0, allStation_1 = allStation; _i < allStation_1.length; _i++) {
            var station = allStation_1[_i];
            stationName.push(station.text.trim());
        }
        new station_model_1.Station(stationName);
    };
    TvSchedule.prototype.initTvSchedule = function () {
        var _this = this;
        var allProgram = this.scheduleData.querySelectorAll('.pgbox');
        var minHeight = this.createOneMinHeight(this.scheduleData.querySelector('.epgtime'));
        this.createStation(this.scheduleData.querySelectorAll('.station'));
        allProgram.forEach(function (program) {
            var title = _this.createProgramTitle(program);
            var detail = _this.createProgramDetail(program);
            var airTime = _this.calculateAirTime(program, minHeight);
            var startAirTime = _this.calculateStartAirTime(program, minHeight);
            _this.programs.push(new program_model_1.Program(_this, title, detail, airTime, startAirTime));
            // console.log('------------------------------------------------------------')
            // console.log(`title: ${title}`)  // 番組名
            // console.log(`detail: ${detail}`) // 番組内容
            // console.log(`airTime: ${airTime}`) // 放送時間
            // console.log(`startAirTime: ${ startAirTime }`) // 放送開始時間
        });
    };
    return TvSchedule;
}());
exports.TvSchedule = TvSchedule;
//# sourceMappingURL=tvSchedule.model.js.map