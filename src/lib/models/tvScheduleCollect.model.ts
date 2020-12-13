import { TvSchedule } from './tvSchedule.model'
import axios from 'axios'
import * as HTMLparse from 'fast-html-parser' 

export class TvScheduleCollect {
  schedules: TvSchedule[]
  
  constructor () {
    this.schedules = []
  }

  private createDay(): number[] {
    const setDay = new Date()
    let today: number[] = []
    today.push(setDay.getFullYear())
    today.push(setDay.getMonth() + 1)
    today.push(setDay.getDate())
    today.push(setDay.getHours())
    today.push(setDay.getMinutes())
    return today
  }

  public async initScheduleCollect() {
    const today = this.createDay()

    // let url = `https://tver.jp/app/epg/23/${today[0]}-${today[1]}-${today[2]}/otd/true`
    // let data = await axios.get(url)
    // let scheduleData = HTMLparse.parse(data.data)
    // this.schedules.push(new TvSchedule(this, `${today[0]}-${today[1]}-${today[2]}`, scheduleData))
    // this.schedules[0].initTvSchedule()
    let url = `https://tver.jp/app/epg/23/${today[0]}-${today[1]}-${today[2]}/otd/true`
    let data = await axios.get(url)
    let scheduleData = HTMLparse.parse(data.data)
    this.schedules.push(new TvSchedule(this, `${today[0]}-${today[1]}-${today[2]}`, scheduleData))
    this.schedules[0].initTvSchedule()

    // 今日の日付を取得
    // roopで先一週間の値を取得
    this.searchProgram()
  }

  public searchProgram(): void {
    const keyWord = 'ニュース'
    let hitProgram: any[] = []
    this.schedules[0].programs.forEach(program => {
      if (program.title.indexOf(keyWord) > 0) {
        hitProgram.push(program)
      }
      // console.log('-----------------------------')
      // console.log(`title: ${program.title}`)
      // console.log(`detail: ${program.detail}`)
    })
    console.log('--------------------------')
    console.log(hitProgram)
  }
}