import { TvSchedule } from './tvSchedule.model'
import { Program } from './program.model'

export class TvScheduleCollect {
  schedules: TvSchedule[]

  programs: Program[]

  constructor () {
    this.schedules = []

    this.programs = []
  }
  /**
   * 今日から1週間分のTvSchedule作成
   */
  public async createWeekSchedule(): Promise<void> {
    let oneDay = 0
    let date = Math.round((new Date()).getTime() / 1000)
    for (let i = 0; i < 7; i++) {
      let day = new Date(date * 1000)
      this.schedules.push(new TvSchedule(this, day.getFullYear(), day.getMonth() + 1, day.getDate(), date))
      date += 24 * 60 * 60
      await this.schedules[oneDay++].initTvSchedule()
    }
  }
  /**
   * 同一の番組があった際、統合する
   */
  private integrateProgram(programs: Program[]): Program {
    let next: Program
    let prev: Program
    if (programs[0].startAirTime < programs[1].startAirTime) {
      next = programs[0]
      prev = programs[1]
    } else {
      next = programs[1]
      prev = programs[0]
    }
    let startAirTime = next.startAirTime * 60 - prev.airTime
    let hours = Math.floor(startAirTime / 60)
    let minutes = startAirTime % 60 / 100
    startAirTime = hours + minutes
    next.startAirTime = startAirTime
    return next
  }
  /**
   * programsに同一番組がある場合integrateProgramを実行する
   */
  private createIntegrateProgram(programs: Program[], ids: number[]): Program[] {
    let createIntegratePrograms: Program[] = []
    ids.forEach(id => {
      let matchPrograms = programs.filter(program => program.id === id)
      if (matchPrograms.length === 1) createIntegratePrograms.push(matchPrograms[0])
      else createIntegratePrograms.push(this.integrateProgram(matchPrograms))
    })
    return createIntegratePrograms
  }
  /**
   * 番組のlengthを取得
   */
  private createProgramsLength(searchedPrograms: Program[]): number[] {
    const searchedProgramsId: number[] = []
    searchedPrograms.forEach(program => {
      if (searchedProgramsId.indexOf(program.id) < 0)
        searchedProgramsId.push(program.id)
    })
    return searchedProgramsId
  }
  /**
   * 最終的に予約する番組を取得する
   */
  private createMustReservePrograms(programs: Program[]): Program[] {
    const programsId = this.createProgramsLength(programs)
    if (programs.length === programsId.length) {
      return programs
    } else {
      // test
      // return programs
      return this.createIntegrateProgram(programs, programsId)
    }
  }
  /**
   * 登録したキーワードとマッチする番組をピックアップ
   */
  public searchPrograms(keyword: string): Program[] {
    let shouldReservePrograms: Program[] = []
    this.schedules.forEach(schedule => {
      let hitPrograms = schedule.searchPrograms(keyword)
      hitPrograms.forEach(program => {
        shouldReservePrograms.push(program)
      })
    })
    // return this.createMustReservePrograms(shouldReservePrograms) // test
    return shouldReservePrograms
  }
}