import { TvScheduleCollect } from './lib/models/tvScheduleCollect.model'

const tvScheduleCollect = new TvScheduleCollect()
// tvScheduleCollect.initScheduleCollect()


//   vvvvv    teet     vvvvv
tvScheduleCollect.createWeekSchedule().then( () => {
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
})
//   ^^^^^    test    ^^^^^