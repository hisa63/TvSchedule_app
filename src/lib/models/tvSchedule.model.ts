import { TvScheduleCollect } from './tvScheduleCollect.model'
import { Program } from './program.model'
import { Station } from './station.model'
import axios from 'axios'
import * as HTMLparse from 'fast-html-parser' 

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
    const hours = Math.floor(aboutStartTime)
    const minutes = Math.round(aboutStartTime % Math.floor(aboutStartTime) * .6 * 100)
    const newStartTime = new Date(this.year, this.month - 1, this.day, hours, minutes, 0)
    const startTimeStamp = Math.floor(newStartTime.getTime() / 1000)
    return startTimeStamp
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
    const scheduleData = HTMLparse.parse(htmlData.data.split('<Tナイト>').join('').split('<Mナイト>').join('').split('<Wナイト>').join('')
    　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　.split('<U-18歌うま甲子園 新人王決定戦>').join(''))
    let stationNumber = 0
    const allStationProgram = scheduleData.querySelectorAll('.stationRate')
    const minHeight = this.createOneMinHeight(scheduleData.querySelector('.epgtime')!)
    const allStation = this.createStation(scheduleData.querySelectorAll('.station'))

    for (let allProgram of allStationProgram) {
      for (let program of allProgram.querySelectorAll('.pgbox')) { 
        const id = this.createProgramId(program)
        const title = this.createProgramTitle(program)
        const detail = this.createProgramDetail(program)
        const airTime = this.calculateAirTime(program, minHeight)
        const startAirTime = this.calculateStartAirTime(program, minHeight)
        const checkProgram = this.scheduleCollect.programs.find(p => p.id === id)

        if (!checkProgram) {
          const newProgram = new Program(this, id, title, detail, airTime, startAirTime, allStation[stationNumber])
          this.programs.push(newProgram)
          this.scheduleCollect.programs.push(newProgram)
        } else {
          checkProgram.airTime = airTime
          this.programs.push(checkProgram)
        }
      }
      stationNumber++
    }
  }
  /**
   * keywordにmatchする番組の取得
   */
  public searchPrograms(keyword: string): Program[] {
    let hitPrograms: Program[] = []
    this.programs.forEach(program => {
      if ((program.title.match(keyword)) || (program.detail.match(keyword)))
        hitPrograms.push(program)
    })
    return hitPrograms
  }
}