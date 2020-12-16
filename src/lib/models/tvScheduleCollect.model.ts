import { TvSchedule } from './tvSchedule.model'
import axios from 'axios'
import * as HTMLparse from 'fast-html-parser' 
import { SSL_OP_EPHEMERAL_RSA } from 'constants'

export class TvScheduleCollect {
  schedules: TvSchedule[]
  
  constructor () {
    this.schedules = []
  }

  private createDay(): number[] {
    let date = Math.round((new Date()).getTime() / 1000)
    let today = new Date(date * 1000)

    console.log(`date: ${date}`)
    console.log(`today: ${today}`)
    console.log(today.getDate())
    console.log(today.getFullYear())
    console.log(today.getMonth() + 1)

    // let today: number[] = []
    // today.push(date.getFullYear())
    // today.push(setDay.getMonth() + 1)
    // today.push(setDay.getDate())
    // today.push(setDay.getHours())
    // today.push(setDay.getMinutes())
    return []
  }
  /**
   * 今日の日付から1週間分の番組表を取得する
   */
  private createWeekSchedule(): void{
    let oneDay = 0
    let date = Math.round((new Date()).getTime() / 1000)
    for (let i = 0; i < 7; i++) {
      let day = new Date(date * 1000)
      this.schedules.push(new TvSchedule(this, day.getFullYear(), day.getMonth() + 1, day.getDate()))
      date += 24 * 60 * 60
      // urlList.push(`https://tver.jp/app/epg/23/${today[0]}-${today[1]}-${today[2] + day}/otd/true`)
    
    // let dayCount = 0
    // urlList.forEach(async (url) => {
      // let data = await axios.get(url)
      // let scheduleData = HTMLparse.parse((data.data.split('<Tナイト>').join('')).split('mナイト').join(''))
      // this.schedules.push(new TvSchedule(this, `${today[0]}-${today[1]}-${today[2] + dayCount}`, scheduleData))
      
      this.schedules[oneDay++].initTvSchedule()
    }
  }
  // private createWeekSchedule(today: number[]): void{
  //   let urlList: string[] = []
  //   for (let day = 0; day < 7; day++) {
  //     urlList.push(`https://tver.jp/app/epg/23/${today[0]}-${today[1]}-${today[2] + day}/otd/true`)
  //   }
  //   let dayCount = 0
  //   urlList.forEach(async (url) => {
  //     let data = await axios.get(url)
  //     let scheduleData = HTMLparse.parse((data.data.split('<Tナイト>').join('')).split('mナイト').join(''))
  //     this.schedules.push(new TvSchedule(this, `${today[0]}-${today[1]}-${today[2] + dayCount}`, scheduleData))
  //     this.schedules[dayCount++].initTvSchedule()
  //   })
  // }
  /**
   * 番組表を作成 
   */
  public initScheduleCollect() {
    // const today = this.createDay()
    this.createWeekSchedule()

    this.searchProgram()
  }
  /**
   * 登録したキーワードとマッチする番組をピックアップ
   */
  public searchProgram(): void {
    // const keyWordList = ['ニュース', 'こんにちは']
    // let hitProgram: any[] = []
    // this.schedules[0].programs.forEach(program => {
    //   keyWordList.forEach(keyWord => {
    //     if ((program.title.indexOf(keyWord) > 0) || (program.detail.indexOf(keyWord) > 0)) {
    //       hitProgram.push(program)
    //     }
    //   })
    // })

  }
}