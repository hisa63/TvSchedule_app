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
  /**
   * 今日の日付から1週間分の番組表を取得する
   */
  private createWeekSchedule(today: number[]): void{
    // let url = `https://tver.jp/app/epg/23/${today[0]}-${today[1]}-${today[2]}/otd/true`
    let urlList: string[] = []
    for (let day = 0; day < 7; day++) {
      urlList.push(`https://tver.jp/app/epg/23/${today[0]}-${today[1]}-${today[2] + day}/otd/true`)
    }
    let dayCount = 0
    urlList.forEach(async (url) => {
      let data = await axios.get(url)
      let scheduleData = HTMLparse.parse(data.data)
      this.schedules.push(new TvSchedule(this, `${today[0]}-${today[1]}-${today[2] + dayCount}`, scheduleData))
      this.schedules[dayCount++].initTvSchedule()
    })
  }
  /**
   * 番組表を作成 
   */
  public initScheduleCollect() {
    const today = this.createDay()
    this.createWeekSchedule(today)
    // this.searchProgram()
  }
  /**
   * 登録したキーワードとマッチする番組をピックアップ
   */
  public searchProgram(): void {
    console.log(this.schedules[0].programs[0])
    const keyWordList = ['ニュース', 'こんにちは']
    let hitProgram: any[] = []
    this.schedules[0].programs.forEach(program => {
      keyWordList.forEach(keyWord => {
        if ((program.title.indexOf(keyWord) > 0) || (program.detail.indexOf(keyWord) > 0)) {
          hitProgram.push(program)
        }
      })
    })
  }
}