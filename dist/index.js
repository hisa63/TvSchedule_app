"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tvScheduleCollect_model_1 = require("./lib/models/tvScheduleCollect.model");
var tvScheduleCollect = new tvScheduleCollect_model_1.TvScheduleCollect();
// tvScheduleCollect.initScheduleCollect()
//   vvvvv    teet     vvvvv
tvScheduleCollect.createWeekSchedule().then(function () {
    // const date = new Date(2020, 11, 5, 3, 30, 15)
    // const a = date.getTime()
    // const day = new Date(a)
    // const b = Math.floor(a / 1000)
    // const c = a + 24 * 60 * 60
    // const day1 = new Date(c)
    // const test = new Date((b + 24 * 60 * 60) * 1000)
    // console.log(`date: ${date}, a: ${a}, b: ${b}, c: ${c}, day: ${day.getDate()}, fay1: ${day1.getDate()}, test: ${test.getDate()}`)
    var flag = true;
    while (flag) {
        var prompt_1 = require('prompt-sync')();
        var keyword = prompt_1('keywordを入力してください: ');
        var shudReservePrograms = tvScheduleCollect.searchPrograms(keyword);
        shudReservePrograms.forEach(function (program) {
            var day = new Date(program.startAirTime * 1000);
            console.log("--------------------------");
            console.log("date: " + program.tvSchedule.month + "\u6708 " + day.getDate() + "\u65E5 : " + day.getHours() + ":" + day.getMinutes() + "\u301C");
            console.log("title: " + program.title);
            console.log("detail: " + program.detail);
            console.log("id: " + program.id);
            console.log("airTime: " + program.airTime);
        });
        if (keyword === 'fin')
            flag = false;
    }
});
//   ^^^^^    test    ^^^^^
//# sourceMappingURL=index.js.map