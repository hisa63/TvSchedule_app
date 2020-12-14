import { TvScheduleCollect } from './tvScheduleCollect.model'
import { Program } from './program.model'
import { Station } from './station.model'
import axios from 'axios'
import * as HTMLparse from 'fast-html-parser' 
import { threadId } from 'worker_threads'

export class TvSchedule {
  scheduleCollect: TvScheduleCollect
  date: string
  scheduleData: HTMLparse.HTMLElement
  programs: Program[]
  startProgramTime = 5

  constructor (scheduleCollect: TvScheduleCollect, date: string, scheduleData: HTMLparse.HTMLElement) {
    this.date = date
    this.scheduleCollect = scheduleCollect
    this.scheduleData = scheduleData
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
  public initTvSchedule() {
    let stationNumber = 0
    const allStationProgram = this.scheduleData.querySelectorAll('.stationRate')
    const minHeight = this.createOneMinHeight(this.scheduleData.querySelector('.epgtime')!)
    const allStation = this.createStation(this.scheduleData.querySelectorAll('.station'))
    allStationProgram.forEach(allProgram => {
      allProgram.querySelectorAll('.pgbox')!.forEach(program => {
        const title = this.createProgramTitle(program)
        const detail = this.createProgramDetail(program)
        const airTime = this.calculateAirTime(program, minHeight)
        const startAirTime = this.calculateStartAirTime(program, minHeight)
        this.programs.push(new Program(this, title, detail, airTime, startAirTime, allStation[stationNumber]))
        // console.log('------------------------------------------------------------')
        // console.log(`title: ${title}`)  // 番組名
        // console.log(`detail: ${detail}`) // 番組内容
        // console.log(`airTime: ${airTime}`) // 放送時間
        // console.log(`startAirTime: ${ startAirTime }`) // 放送開始時間
      })
      stationNumber++
    })
  }
}