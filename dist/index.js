"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tvScheduleCollect_model_1 = require("./lib/models/tvScheduleCollect.model");
var express_1 = __importDefault(require("express"));
var user_model_1 = require("./lib/models/user.model");
var app = express_1.default();
app.use(express_1.default.json());
var tvScheduleCollect = new tvScheduleCollect_model_1.TvScheduleCollect();
var user = new user_model_1.User();
// tvScheduleCollect.createWeekSchedule()
//   vvvvv    teet     vvvvv
tvScheduleCollect.createWeekSchedule().then(function () {
    // app.get('/', (req, res) => {
    //   res.send(tvScheduleCollect.schedules[0].programs[0].title)
    // })
    /**
     * 指定idの番組を取得
     */
    app.get('/programs/:id', function (req, res) {
        var _a;
        var id = Number(req.params.id);
        res.send((_a = tvScheduleCollect.getProgram(id)) === null || _a === void 0 ? void 0 : _a.toObject());
    });
    /**
     * 指定された日付の番組を取得
     */
    app.get('/programs', function (req, res) {
        var day = req.query.day;
        for (var _i = 0, _a = tvScheduleCollect.schedules; _i < _a.length; _i++) {
            var schedule = _a[_i];
            if (schedule.day === Number(day)) {
                var programs = schedule.programs.map(function (program) { return program.toObject(); });
                res.send(programs);
                break;
            }
        }
    });
    // /**
    //  * querystringのkeyがdayならその日の番組を、keywordならmatchした番組を取得
    //  */
    // app.get('/programs', (req, res) => {
    //   const keyword = req.query.keyword
    //   const day = req.query.day
    //   if (day) {
    //     for (let schedule of tvScheduleCollect.schedules) {
    //       if (schedule.day === Number(day)) {
    //         const programs = schedule.programs.map(program => program.toObject())
    //         res.send(programs)
    //         break
    //       } 
    //     }
    //   } else if (keyword) {
    //     const hitPrograms = tvScheduleCollect.searchPrograms(String(keyword))
    //     const reservePrograms = hitPrograms.map(program => program.toObject())
    //     res.send(reservePrograms)
    //   }
    // })
    app.get('/search/programs/:keyword', function (req, res) {
        var keyword = req.params.keyword;
        var day = req.query.day;
        var reservePrograms = [];
        if (day === undefined) {
            reservePrograms = tvScheduleCollect.searchPrograms(keyword);
        }
        else {
            for (var _i = 0, _a = tvScheduleCollect.schedules; _i < _a.length; _i++) {
                var schedule = _a[_i];
                if (schedule.day === Number(day)) {
                    reservePrograms = schedule.searchPrograms(keyword);
                    break;
                }
            }
        }
        res.send(reservePrograms.map(function (program) { return program.toObject(); }));
    });
    app.get('/:user/reserve/programs', function (req, res) {
        // const reservePrograms = tvScheduleCollect.
    });
    app.post('/users/:userId/keywords', function (req, res) {
        var id = req.params.id;
        var keyword = req.params.keyword;
        // userの配列からreq.params.idと一致するuserを取得
        //const user = getUser()
        user.createKeyword(keyword);
    });
    var port = process.env.PORT || 3000;
    app.listen(port, function () { return console.log("Listening on port " + port + "..."); });
});
//   ^^^^^    test    ^^^^^
// if (keyword === undefined) {
//   const allPrograms = tvScheduleCollect.programs.map(program => program.toObject())
//   res.send(allPrograms)
// } else {
//   const hitPrograms = tvScheduleCollect.searchPrograms(String(keyword))
//   const reservePrograms = hitPrograms.map(program => program.toObject())
//   res.send(reservePrograms)
// }
//# sourceMappingURL=index.js.map