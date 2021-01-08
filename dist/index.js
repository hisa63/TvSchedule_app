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
    function searchPrograms(programs, keyword) {
        var reservePrograms = [];
        programs.forEach(function (program) {
            if ((program.title.match(keyword)) || (program.detail.match(keyword)))
                reservePrograms.push(program);
        });
        if (!reservePrograms.length)
            throw new Error("keyword: \"" + keyword + "\" \u306B\u8A72\u5F53\u3059\u308B\u756A\u7D44\u306F\u3042\u308A\u307E\u305B\u3093\u3067\u3057\u305F");
        return reservePrograms;
    }
    /**
     * keywordに該当する番組の取得、querystringで日付指定がある場合は指定された日付から該当する番組を取得
     */
    app.get('/programs', function (req, res) {
        try {
            var keyword = req.query.keyword;
            var date = req.query.date;
            var reservePrograms = [];
            if (date !== undefined) {
                if (date.split('/').length !== 3)
                    throw new Error('日付を正しく入力してください　ex)YYYY/MM/DD');
                reservePrograms = tvScheduleCollect.getSchedulePrograms(date);
            }
            else {
                reservePrograms = tvScheduleCollect.programs;
            }
            if (keyword !== undefined)
                reservePrograms = searchPrograms(reservePrograms, keyword);
            res.status(200);
            res.send(reservePrograms.map(function (program) { return program.toObject(); }));
        }
        catch (error) {
            res.status(400);
            res.send({ error: error.message });
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
//# sourceMappingURL=index.js.map