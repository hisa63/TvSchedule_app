"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvScheduleCollect = void 0;
var tvSchedule_model_1 = require("./tvSchedule.model");
var TvScheduleCollect = /** @class */ (function () {
    function TvScheduleCollect() {
        this.schedules = [];
    }
    /**
     * 今日から1週間分のTvSchedule作成
     */
    TvScheduleCollect.prototype.createWeekSchedule = function () {
        return __awaiter(this, void 0, void 0, function () {
            var oneDay, date, i, day;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oneDay = 0;
                        date = Math.round((new Date()).getTime() / 1000);
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 7)) return [3 /*break*/, 4];
                        day = new Date(date * 1000);
                        this.schedules.push(new tvSchedule_model_1.TvSchedule(this, day.getFullYear(), day.getMonth() + 1, day.getDate()));
                        date += 24 * 60 * 60;
                        return [4 /*yield*/, this.schedules[oneDay++].initTvSchedule()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 同一の番組があった際、統合する
     */
    TvScheduleCollect.prototype.integrateProgram = function (programs) {
        var next;
        var prev;
        if (programs[0].startAirTime < programs[1].startAirTime) { // 1 - night
            next = programs[0];
            prev = programs[1];
            // programs[0].startAirTime = (programs[0].startAirTime * 60 - programs[1].airTime) / 60
            // return programs[0]
        }
        else {
            next = programs[1];
            prev = programs[0];
            // programs[1].airTime = programs[0].airTime
            // programs[1].startAirTime = (programs[1].startAirTime * 60 - programs[0].airTime) / 60
            // return programs[1]      
        }
        var startAirTime = next.startAirTime * 60 - prev.airTime;
        var hours = Math.floor(startAirTime / 60);
        var minutes = startAirTime % 60 / 100;
        startAirTime = hours + minutes;
        next.startAirTime = startAirTime;
        // console.log(`next: ${next.startAirTime}`)
        // console.log(`startAirTime: ${startAirTime}`)
        // console.log(`hour: ${hours}`)
        // console.log(`min: ${minutes}`)
        return next;
        // if (programs[0].startAirTime > programs[1].startAirTime) {
        //   programs[0].airTime += programs[1].airTime
        //   return programs[0]
        // } else {
        //   programs[1].airTime += programs[0].airTime
        //   return programs[1]      
        // }
    };
    /**
     * programsに同一番組がある場合integrateProgramを実行する
     */
    TvScheduleCollect.prototype.createIntegrateProgram = function (programs, ids) {
        var _this = this;
        var createIntegratePrograms = [];
        ids.forEach(function (id) {
            var matchPrograms = programs.filter(function (program) { return program.id === id; });
            if (matchPrograms.length === 1)
                createIntegratePrograms.push(matchPrograms[0]);
            else
                createIntegratePrograms.push(_this.integrateProgram(matchPrograms));
        });
        return createIntegratePrograms;
    };
    /**
     * 番組のlengthを取得
     */
    TvScheduleCollect.prototype.createProgramsLength = function (searchedPrograms) {
        var searchedProgramsId = [];
        searchedPrograms.forEach(function (program) {
            if (searchedProgramsId.indexOf(program.id) < 0)
                searchedProgramsId.push(program.id);
        });
        return searchedProgramsId;
    };
    /**
     * 最終的に予約する番組を取得する
     */
    TvScheduleCollect.prototype.createMustReservePrograms = function (programs) {
        var programsId = this.createProgramsLength(programs);
        if (programs.length === programsId.length) {
            return programs;
        }
        else {
            // test
            // return programs
            return this.createIntegrateProgram(programs, programsId);
        }
    };
    /**
     * 登録したキーワードとマッチする番組をピックアップ
     */
    TvScheduleCollect.prototype.searchPrograms = function (keyword) {
        var shouldReservePrograms = [];
        this.schedules.forEach(function (schedule) {
            var hitPrograms = schedule.searchPrograms(keyword);
            hitPrograms.forEach(function (program) {
                shouldReservePrograms.push(program);
            });
        });
        return this.createMustReservePrograms(shouldReservePrograms);
    };
    return TvScheduleCollect;
}());
exports.TvScheduleCollect = TvScheduleCollect;
//# sourceMappingURL=tvScheduleCollect.model.js.map