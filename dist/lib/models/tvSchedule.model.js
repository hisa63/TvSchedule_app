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
    /**
     * 1時間当たりのheigthのpxを計算する
     */
    TvSchedule.prototype.createOneMinHeight = function (epgTime) {
        var minHeight = (Math.round(Number(epgTime.attributes.style.match(/(?<=height:).*(?=px;)/)) / 1440 * 10) / 10);
        return minHeight;
    };
    /**
     * 放送時間を計算する
     */
    TvSchedule.prototype.calculateAirTime = function (program, minHeight) {
        var programHeight = program.attributes.style.match(/(?<=height:).*(?=px;left)/);
        var airTime = Math.round(Number(programHeight) / minHeight);
        return airTime;
    };
    /**
     * 放送開始時間を計算する
     */
    TvSchedule.prototype.calculateStartAirTime = function (program, minHeight) {
        var startProgramHeight = program.attributes.style.match(/(?<=top:).*(?=px)/);
        var aboutStartTime = this.startProgramTime + Math.round(Number(startProgramHeight) / minHeight) / 60;
        var startAirTime = Math.floor(aboutStartTime) + Math.round(aboutStartTime % Math.floor(aboutStartTime) * .6 * 100) / 100;
        return startAirTime;
    };
    /**
     * 番組のidを取得する
     */
    TvSchedule.prototype.createProgramId = function (program) {
        var id = Number(program.attributes.id);
        return id;
    };
    /**
     * 番組のタイトルを取得する
     */
    TvSchedule.prototype.createProgramTitle = function (program) {
        var title = program.querySelector('.title').text;
        return title;
    };
    /**
     * 番組の概要を取得する
     */
    TvSchedule.prototype.createProgramDetail = function (program) {
        var detail = program.querySelector('p').text;
        return detail;
    };
    /**
     * 各放送局を取得し、インスタンスを作成する
     */
    TvSchedule.prototype.createStation = function (allStation) {
        var stationName = [];
        for (var _i = 0, allStation_1 = allStation; _i < allStation_1.length; _i++) {
            var station = allStation_1[_i];
            stationName.push(station.text.trim());
        }
        new station_model_1.Station(stationName);
        return stationName;
    };
    /**
     * 番組表の作成
     */
    TvSchedule.prototype.initTvSchedule = function () {
        var _this = this;
        var stationNumber = 0;
        var allStationProgram = this.scheduleData.querySelectorAll('.stationRate');
        var minHeight = this.createOneMinHeight(this.scheduleData.querySelector('.epgtime'));
        var allStation = this.createStation(this.scheduleData.querySelectorAll('.station'));
        allStationProgram.forEach(function (allProgram) {
            allProgram.querySelectorAll('.pgbox').forEach(function (program) {
                var id = _this.createProgramId(program);
                var title = _this.createProgramTitle(program);
                var detail = _this.createProgramDetail(program);
                var airTime = _this.calculateAirTime(program, minHeight);
                var startAirTime = _this.calculateStartAirTime(program, minHeight);
                _this.programs.push(new program_model_1.Program(_this, id, title, detail, airTime, startAirTime, allStation[stationNumber]));
                //   console.log('------------------------------------------------------------')
                //   console.log(`station: ${allStation[stationNumber]}`)
                //   console.log(`id: ${id}`)
                //   console.log(`title: ${title}`)  // 番組名
                //   console.log(`detail: ${detail}`) // 番組内容
                //   console.log(`airTime: ${airTime}`) // 放送時間
                //   console.log(`startAirTime: ${ startAirTime }`) // 放送開始時間
            });
            stationNumber++;
        });
        console.log(this.scheduleCollect.schedules.length);
    };
    return TvSchedule;
}());
exports.TvSchedule = TvSchedule;
//# sourceMappingURL=tvSchedule.model.js.map