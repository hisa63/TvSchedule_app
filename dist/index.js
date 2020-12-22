"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tvScheduleCollect_model_1 = require("./lib/models/tvScheduleCollect.model");
var tvScheduleCollect = new tvScheduleCollect_model_1.TvScheduleCollect();
// tvScheduleCollect.initScheduleCollect()
//   vvvvv    teet     vvvvv
tvScheduleCollect.createWeekSchedule().then(function () {
    // let flag = true
    // while (flag) {
    //   const prompt = require('prompt-sync')()
    //   const keyword = prompt('keywordを入力してください: ') as string
    //   let shudReservePrograms = tvScheduleCollect.searchPrograms(keyword)
    //   shudReservePrograms.forEach(program => {
    //     console.log(`--------------------------`)
    //     console.log(`date: ${program.tvSchedule.month}月 ${program.tvSchedule.day}日 ${program.startAirTime}〜`)
    //     console.log(`title: ${program.title}`)
    //     console.log(`detail: ${program.detail}`)
    //     console.log(`id: ${program.id}`)
    //     console.log(`airTime: ${program.airTime}`)
    //   })
    //   if (keyword === 'fin') flag = false
    // }
    tvScheduleCollect.schedules[0].programs.forEach(function (program) {
        console.log(program.title);
    });
});
//   ^^^^^    test    ^^^^^
//# sourceMappingURL=index.js.map