"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tvScheduleCollect_model_1 = require("./lib/models/tvScheduleCollect.model");
var tvScheduleCollect = new tvScheduleCollect_model_1.TvScheduleCollect();
// tvScheduleCollect.initScheduleCollect()
tvScheduleCollect.createWeekSchedule().then(function () {
    // tvScheduleCollect.schedules.forEach(schedule => {
    //   schedule.programs.forEach(program => {
    //     console.log('-----------------------')
    //     console.log(`title: ${program.title}`)
    //     console.log(`detail: ${program.detail}`)
    //   })
    // })
    var flag = true;
    while (flag) {
        var prompt_1 = require('prompt-sync')();
        var keyword = prompt_1('keywordを入力してください: ');
        var shudReservePrograms = tvScheduleCollect.searchPrograms(keyword);
        shudReservePrograms.forEach(function (program) {
            console.log("--------------------------");
            console.log("date: " + program.tvSchedule.month + "\u6708 " + program.tvSchedule.day + "\u65E5 " + program.startAirTime + "\u301C");
            console.log("title: " + program.title);
            console.log("detail: " + program.detail);
            console.log("id: " + program.id);
            console.log("airTime: " + program.airTime);
        });
        if (keyword === 'fin')
            flag = false;
    }
});
//# sourceMappingURL=index.js.map