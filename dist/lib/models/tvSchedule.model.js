"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvSchedule = void 0;
var program_model_1 = require("./program.model");
var station_model_1 = require("./station.model");
var axios_1 = __importDefault(require("axios"));
var HTMLparse = __importStar(require("fast-html-parser"));
var TvSchedule = /** @class */ (function () {
    function TvSchedule(scheduleCollect, year, month, day) {
        this.startProgramTime = 5;
        this.year = year;
        this.month = month;
        this.day = day;
        this.scheduleCollect = scheduleCollect;
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
        return __awaiter(this, void 0, void 0, function () {
            var url, htmlData, scheduleData, stationNumber, allStationProgram, minHeight, allStation, tmpArray, _i, allStationProgram_1, allProgram;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "https://tver.jp/app/epg/23/" + this.year + "-" + this.month + "-" + this.day + "/otd/true";
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 1:
                        htmlData = _a.sent();
                        scheduleData = HTMLparse.parse(htmlData.data.split('<Tナイト>').join('').split('<Mナイト>').join('').split('<Wナイト>').join(''));
                        stationNumber = 0;
                        allStationProgram = scheduleData.querySelectorAll('.stationRate');
                        minHeight = this.createOneMinHeight(scheduleData.querySelector('.epgtime'));
                        allStation = this.createStation(scheduleData.querySelectorAll('.station'));
                        tmpArray = [];
                        for (_i = 0, allStationProgram_1 = allStationProgram; _i < allStationProgram_1.length; _i++) {
                            allProgram = allStationProgram_1[_i];
                            allProgram.querySelectorAll('.pgbox').forEach(function (program) {
                                var id = _this.createProgramId(program);
                                var title = _this.createProgramTitle(program);
                                var detail = _this.createProgramDetail(program);
                                var airTime = _this.calculateAirTime(program, minHeight);
                                var startAirTime = _this.calculateStartAirTime(program, minHeight);
                                _this.programs.push(new program_model_1.Program(_this, id, title, detail, airTime, startAirTime, allStation[stationNumber]));
                                // console.log('------------------------------------------------------------')
                                // console.log(`station: ${allStation[stationNumber]}`)
                                // console.log(`id: ${id}`)
                                // console.log(`title: ${title}`)  // 番組名
                                // console.log(`detail: ${detail}`) // 番組内容
                                // console.log(`airTime: ${airTime}`) // 放送時間
                                // console.log(`startAirTime: ${ startAirTime }`) // 放送開始時間
                            });
                            stationNumber++;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * keywordにmatchする番組の取得
     */
    TvSchedule.prototype.searchPrograms = function (keyword) {
        var hitPrograms = [];
        this.programs.forEach(function (program) {
            if ((program.title.match(keyword)) || (program.title.match(keyword)))
                hitPrograms.push(program);
        });
        return hitPrograms;
    };
    return TvSchedule;
}());
exports.TvSchedule = TvSchedule;
//# sourceMappingURL=tvSchedule.model.js.map