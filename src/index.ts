import { TvScheduleCollect } from './lib/models/tvScheduleCollect.model'

const tvScheduleCollect = new TvScheduleCollect()
// tvScheduleCollect.initScheduleCollect()


//   vvvvv    teet     vvvvv

tvScheduleCollect.createWeekSchedule().then( () => {
  // const date = new Date(2020, 11, 5, 3, 30, 15)
  // const a = date.getTime()
  // const day = new Date(a)
  // const b = Math.floor(a / 1000)
  // const c = a + 24 * 60 * 60
  // const day1 = new Date(c)
  // const test = new Date((b + 24 * 60 * 60) * 1000)
  // console.log(`date: ${date}, a: ${a}, b: ${b}, c: ${c}, day: ${day.getDate()}, fay1: ${day1.getDate()}, test: ${test.getDate()}`)

  let flag = true
  while (flag) {
    const prompt = require('prompt-sync')()
    const keyword = prompt('keywordを入力してください: ') as string
    let shudReservePrograms = tvScheduleCollect.searchPrograms(keyword)
    shudReservePrograms.forEach(program => {
      let day = new Date(program.startAirTime * 1000)
      console.log(`--------------------------`)
      console.log(`date: ${program.tvSchedule.month}月 ${day.getDate()}日 : ${day.getHours()}:${day.getMinutes()}〜`)
      console.log(`title: ${program.title}`)
      console.log(`detail: ${program.detail}`)
      console.log(`id: ${program.id}`)
      console.log(`airTime: ${program.airTime}`)
    })
    if (keyword === 'fin') flag = false
  }
})
//   ^^^^^    test    ^^^^^
