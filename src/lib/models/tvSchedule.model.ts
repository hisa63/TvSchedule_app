import { TvScheduleCollect } from './tvScheduleCollect.model'
import { Program } from './program.model'
import { Station } from './station.model'
import axios from 'axios'
import * as HTMLparse from 'fast-html-parser' 
import { start } from 'repl'

export class TvSchedule {
  scheduleCollect: TvScheduleCollect
  year: number
  month: number
  day: number
  programs: Program[]
  readonly timeStamp: number
  readonly startProgramTime = 5

  constructor (scheduleCollect: TvScheduleCollect, year: number, month: number, day: number, timeStamp: number) {
    this.year = year
    this.month = month
    this.day = day
    this.scheduleCollect = scheduleCollect
    this.programs = []
    this.timeStamp = timeStamp
  }
  /**
   * 1時間当たりのheigthのpxを計算する
   */
  private createOneMinHeight(epgTime: HTMLparse.HTMLElement): number {
    const minHeight = (Math.round(Number(epgTime.attributes.style.match(/(?<=height:).*(?=px;)/)) / 1440 * 10) / 10)
    return minHeight
  }
  /**
   * 放送時間を計算する 
   */
  private calculateAirTime(program: HTMLparse.HTMLElement, minHeight: number): number {
    const programHeight = program.attributes.style.match(/(?<=height:).*(?=px;left)/)
    const airTime = Math.round(Number(programHeight) / minHeight)
    return airTime
  }
  /**
   * 放送開始時間を計算する
   */
  private calculateStartAirTime(program: HTMLparse.HTMLElement, minHeight: number): number {
    const startProgramHeight = program.attributes.style.match(/(?<=top:).*(?=px)/)
    const aboutStartTime = this.startProgramTime + Math.round(Number(startProgramHeight) / minHeight) / 60
    const startAirTime = Math.floor(aboutStartTime) + Math.round(aboutStartTime % Math.floor(aboutStartTime) * .6 * 100) / 100
    return startAirTime
  }
  /**
   * 番組のidを取得する
   */
  private createProgramId(program: HTMLparse.HTMLElement): number {
    const id = Number(program.attributes.id)
    return id
  }
  /**
   * 番組のタイトルを取得する
   */
  private createProgramTitle(program: HTMLparse.HTMLElement): string {
    const title = program.querySelector('.title')!.text
    return title
  }
  /**
   * 番組の概要を取得する
   */
  private createProgramDetail(program: HTMLparse.HTMLElement): string {
    const detail = program.querySelector('p')!.text
    return detail
  }
  /**
   * 各放送局を取得し、インスタンスを作成する
   */
  private createStation(allStation: HTMLparse.HTMLElement[]): string[] {
    const stationName: string[] = []
    for (let station of allStation) {
      stationName.push(station.text.trim())
    }
    new Station(stationName)
    return stationName
  }
  /**
   * 同じidのインスタンスがあるか確認する
   */
  private checkProgramId(id: number): Program | null {
    let hasProgram: Program | null = null
    this.scheduleCollect.programs.forEach(program => {
      if (program.id === id) hasProgram = program
    })
    return hasProgram
  }
  /**
   * 統合したprogramを前日 or 翌日のscheduleにpushする 
   */
  private pushProgram(program: Program, oneDay: number): void {
    const date1 = this.timeStamp
    const day1 = new Date(date1 * 1000)
    // console.log(`testDay: ${day1.getDate()}`)
    const date = this.timeStamp
    const day = new Date(date * 1000)

    this.scheduleCollect.schedules.forEach(schedule => {
      if (program.title === 'はやドキ!')
      console.log(`title: ${program.title}, shceduleDay: ${schedule.day}, day: ${day.getDate()}, test: ${program.straddleFiveTime}, testDay: ${day1.getDate()}`)
      if (schedule.day === day.getDate()) {
        schedule.programs.push(program)
      }
    })
    // for (let schedule of this.scheduleCollect.schedules) {
    //   if (schedule.day === day.getDate()) {
    //     schedule.programs.push(program)
    //   }
    // }
  }
  /**
   * 同一番組の統合を行う
   */
  private integrateProgram(program: Program, airTime: number, startAirTime: number): void {
    if (program.startAirTime > startAirTime) {  // program - night
      program.airTime = airTime
      // 翌日のスケジュールにpush
      program.straddleFiveTime = -24
    } else { // program - morning
      let startTime = program.airTime * 60 - airTime
      let hours = Math.floor(startTime / 60)
      let minutes = startTime % 60 / 100
      startTime = hours + minutes
      program.startAirTime = startTime
      // 前日のスケジュールにpush
      program.straddleFiveTime = 24
    }
    this.programs.push(program)
  }
  /**
   * 番組表の作成
   */
  public async initTvSchedule() {
    const url = `https://tver.jp/app/epg/23/${this.year}-${this.month}-${this.day}/otd/true`
    const htmlData = await axios.get(url)
    const scheduleData = HTMLparse.parse(htmlData.data.split('<Tナイト>').join('').split('<Mナイト>').join('').split('<Wナイト>').join(''))
    let stationNumber = 0
    const allStationProgram = scheduleData.querySelectorAll('.stationRate')
    const minHeight = this.createOneMinHeight(scheduleData.querySelector('.epgtime')!)
    const allStation = this.createStation(scheduleData.querySelectorAll('.station'))

    for(let allProgram of allStationProgram) {
      allProgram.querySelectorAll('.pgbox')!.forEach(program => {        
        const id = this.createProgramId(program)
        const title = this.createProgramTitle(program)
        const detail = this.createProgramDetail(program)
        const airTime = this.calculateAirTime(program, minHeight)
        const startAirTime = this.calculateStartAirTime(program, minHeight)
        // if (startAirTime !== 5 && (startAirTime + airTime) < 29)
        const checkProgram = this.checkProgramId(id)
        // console.log(`program: ${checkProgram}`)
        if (checkProgram === null) {
          const newProgram = new Program(this, id, title, detail, airTime, startAirTime, allStation[stationNumber])
          this.programs.push(newProgram)
          this.scheduleCollect.programs.push(newProgram)
        } else {
          this.integrateProgram(checkProgram, airTime, startAirTime)
        }
        // this.programs.push(new Program(this, id, title, detail, airTime, startAirTime, allStation[stationNumber]))


        // console.log('------------------------------------------------------------')
        // console.log(`station: ${allStation[stationNumber]}`)
        // console.log(`id: ${id}`)
        // console.log(`title: ${title}`)  // 番組名
        // console.log(`detail: ${detail}`) // 番組内容
        // console.log(`airTime: ${airTime}`) // 放送時間
        // console.log(`startAirTime: ${ startAirTime }`) // 放送開始時間
      })
      stationNumber++
    }
  }
  /**
   * keywordにmatchする番組の取得
   */
  public searchPrograms(keyword: string): Program[] {
    let hitPrograms: Program[] = []
    this.programs.forEach(program => {
      if ((program.title.match(keyword)) || (program.title.match(keyword)))
        hitPrograms.push(program)
    })
    return hitPrograms
  }
}