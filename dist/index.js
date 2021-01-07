"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var tvScheduleCollect_model_1 = require("./lib/models/tvScheduleCollect.model");
var user_model_1 = require("./lib/models/user.model");
var app = express_1.default();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
var tvScheduleCollect = new tvScheduleCollect_model_1.TvScheduleCollect();
var users = [new user_model_1.User({
        id: '1',
        name: 'hisa'
    })];
tvScheduleCollect.createWeekSchedule().then(function () {
    /**
     * keywordに該当する番組の取得、querystringで日付指定がある場合は指定された日付から該当する番組を取得
     */
    app.get('/programs', function (req, res) {
        try {
            var keyword = req.query.keyword;
            var date = req.query.date;
            var reservePrograms = [];
            if (date === undefined) {
                if (keyword !== undefined)
                    reservePrograms = tvScheduleCollect.searchPrograms(String(keyword));
                else
                    reservePrograms = tvScheduleCollect.programs;
            }
            else {
                var day = date.split("/");
                for (var _i = 0, _a = tvScheduleCollect.schedules; _i < _a.length; _i++) {
                    var schedule = _a[_i];
                    if (schedule.day === Number(day[2])) {
                        if (keyword !== undefined)
                            reservePrograms = schedule.searchPrograms(String(keyword));
                        else
                            reservePrograms = schedule.programs;
                        break;
                    }
                }
            }
            res.status(200);
            res.send(reservePrograms.map(function (program) { return program.toObject(); }));
        }
        catch (error) {
            res.status(400);
            // res.send(error: error.message)
        }
    });
    /**
     * 指定idの番組を取得
     */
    app.get('/programs/:id', function (req, res) {
        var _a;
        try {
            var id_1 = Number(req.params.id);
            var program = tvScheduleCollect.programs.find(function (p) { return p.id === id_1; });
            if (!id_1)
                throw new Error("");
            res.send((_a = tvScheduleCollect.getProgram(id_1)) === null || _a === void 0 ? void 0 : _a.toObject());
        }
        catch (error) {
        }
    });
    /**
     * 予約する番組を取得
     */
    // app.get('/reservations', (req, res) => {
    //   const reservePrograms = user.reservePrograms.map(program => program.program.toObject())
    //   res.send(reservePrograms)
    // })
    /**
     * 番組を予約する
     */
    app.post('/reservations', function (req, res) {
        try {
            var reservation_1 = req.body;
            // error checkをしてください       
            if (!reservation_1.program_id)
                throw new Error('program_idを指定してください');
            if (!reservation_1.user_id)
                throw new Error('user_idを指定してください');
            var user = users.find(function (u) { return u.id === reservation_1.user_id; });
            if (!user)
                throw new Error("user_id " + reservation_1.user_id + "\u306F\u5B58\u5728\u3057\u307E\u305B\u3093");
            if (user.isAlreadyReserved(reservation_1.program_id))
                throw new Error(reservation_1.program_id + " \u306F\u3059\u3067\u306B\u4E88\u7D04\u3055\u308C\u3066\u3044\u307E\u3059");
            var program = tvScheduleCollect.programs.find(function (p) { return p.id === reservation_1.program_id; });
            if (!program)
                throw new Error("program_id " + reservation_1.program_id + "\u306F\u5B58\u5728\u3057\u307E\u305B\u3093");
            var newReservation = user.createReserveProgram(program);
            res.status(200);
            res.send(newReservation.toObject());
        }
        catch (error) {
            res.status(400);
            res.send({ error: error.message });
        }
    });
    // app.post('/users/:userId/programs/:programId/reserves', (req, res) => {
    //   const program = req.params.program
    //   user.createReserveProgram(Number(program))
    // })
    /**
     * 予約番組を削除する
     */
    // app.delete('/reservations/:reservationId', (req, res) => {
    //   const programId = req.params.programId
    //   user.testDeleteProgram(Number(programId))
    //   res.send(programId)
    // })
    /**
     * 新規でkeywordを登録する
     */
    // app.post('/keywords', (req, res) => {
    //   const id = req.params.id
    //   const keyword = req.params.keyword
    //   // userの配列からreq.params.idと一致するuserを取得
    //   //const user = getUser()
    //   user.createKeyword(keyword)
    // })
    /**
     * 該当するkeywordを削除
     */
    // app.delete('/keywords/:keywordId', (req, res) => {
    //   const keyword = req.params.keyword
    //   user.deleteKeyword(keyword)
    //   res.send(keyword)
    // })
    var port = process.env.PORT || 3000;
    app.listen(port, function () { return console.log("Listening on port " + port + "..."); });
});
// if (keyword === undefined) {
//   const allPrograms = tvScheduleCollect.programs.map(program => program.toObject())
//   res.send(allPrograms)
// } else {
//   const hitPrograms = tvScheduleCollect.searchPrograms(String(keyword))
//   const reservePrograms = hitPrograms.map(program => program.toObject())
//   res.send(reservePrograms)
// }
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
// /**
//  * 指定された日付の番組を取得
//  */
// app.get('/programs', (req, res) => {
//   const keyword = req.query.keyword 
//   const day = req.query.day
//   if (keyword) {
//     // きーわーどが含まれているプログラムにしぼる
//   } 
//   if (day) {
//     // 日付でさらにしぼる
//   }
//   console.log('check')
//   for (let schedule of tvScheduleCollect.schedules) {
//     if (schedule.day === Number(day)) {
//       const programs = schedule.programs.map(program => program.toObject())
//       res.send(programs)
//       break
//     }
//   }
// })
//# sourceMappingURL=index.js.map