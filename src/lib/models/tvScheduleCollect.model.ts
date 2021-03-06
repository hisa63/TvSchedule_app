import { TvSchedule } from './tvSchedule.model'
import { Program } from './program.model'
import { NotFoundError } from '../errors'

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
   * 重複する番組がある場合、番組を1つにする
   */
  private createIntegrateProgram(programs: Program[], ids: number[]): Program[] {
    let createIntegratePrograms: Program[] = []
    ids.forEach(id => {
      let matchPrograms = programs.filter(program => program.id === id)
      if (matchPrograms.length === 1) createIntegratePrograms.push(matchPrograms[0])
      else createIntegratePrograms.push(matchPrograms[0])
    })
    return createIntegratePrograms
  }
  /**
   * 重複する番組を統合した後の番組数を取得
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
    shouldReservePrograms = this.createMustReservePrograms(shouldReservePrograms)　// 最終的に予約する番組を返す
    if (!shouldReservePrograms.length) throw new NotFoundError(`指定されたkeyword:[${keyword}]に該当する番組はありませんでした`)
    return shouldReservePrograms
  }
  /**
   * 指定された日付の番組表があるかチェックする
   */
  public getSpecifiedSchedule(date: moment.Moment): TvSchedule {
    const year = date.year()
    const month = date.month() + 1
    const day = date.date()

    for (let schedule of this.schedules) {
      if (schedule.year === year && schedule.month === month && schedule.day === day) return schedule
    }
    throw new NotFoundError(`${year}年${month}月${day}日の番組表は存在しません`)
  }
}