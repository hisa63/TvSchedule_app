import { TvScheduleCollect } from './tvScheduleCollect.model'
import { Program } from './program.model'
import { Station } from './station.model'
import axios from 'axios'
import * as HTMLparse from 'fast-html-parser' 

export class TvSchedule {
  scheduleCollect: TvScheduleCollect
  // date: string
  // scheduleData: HTMLparse.HTMLElement
  year: number
  month: number
  day: number
  programs: Program[]
  readonly startProgramTime = 5

  // constructor (scheduleCollect: TvScheduleCollect, date: string, scheduleData: HTMLparse.HTMLElement) {
    constructor (scheduleCollect: TvScheduleCollect, year: number, month: number, day: number) {
      this.year = year
      this.month = month
      this.day = day
      this.scheduleCollect = scheduleCollect
      // this.scheduleData = scheduleData
      this.programs = []
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
   * 番組表の作成
   */
  public async initTvSchedule() {
    const url = `https://tver.jp/app/epg/23/${this.year}-${this.month}-${this.day}/otd/true`
    const htmlData = await axios.get(url)
    const scheduleData = HTMLparse.parse(htmlData.data.split('<Tナイト>').join('').split('<Mナイト>').join(''))
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
        this.programs.push(new Program(this, id, title, detail, airTime, startAirTime, allStation[stationNumber]))
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
}