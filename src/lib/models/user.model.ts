import { Keyword } from './keyword.model'
import { TvScheduleCollect } from './tvScheduleCollect.model'
import { Reservation } from './reservation.model'
import { Program } from './program.model'

export class User {
  id: number
  name: string
  keywords: Keyword[]
  reservePrograms: Reservation[]

  constructor() {
    this.id = 1
    this.name = 'hisa'
    this.keywords = []
    this.reservePrograms = []
  }
  /**
   * keywordがすでに登録されているか確認する
   */
  private hasKeyword(inputWord: string): boolean {
    for (let key of this.keywords) {
      if (key.keyword === inputWord) return true
    }
    return false
  }
  /**
   * 予約されている番組のidを配列にして取得
   */
  private createReserveProgramsId(): number[] {
    const reserveProgramsId = this.reservePrograms.map(reserveProgram => {
      return reserveProgram.program.id
    })
    return reserveProgramsId
  }
  /**
   * 入力されたwordをkeywordに登録する 
   */
  public createKeyword(inputWord: string): void {
    if (this.hasKeyword(inputWord) === false)
      this.keywords.push(new Keyword(this, inputWord))
  }
  /**
   * 入力されたwordをkeywordから削除する
   */
  public deleteKeyword(inputWord: string): void {
    const words = this.keywords.map(key => { return key.keyword })
    const index = words.indexOf(inputWord)
    if (index >= 0) this.keywords.splice(index, 1)
  }
  /**
   * 予約一覧に指定された番組がなければ予約をする
   */
  public createReserveProgram(program: Program): void {
    const reserveProgramsId = this.createReserveProgramsId()
    if (reserveProgramsId.indexOf(program.id) < 0)
      this.reservePrograms.push(new Reservation(program, this))
  }
  /**
   * 指定された番組の予約を削除する
   */
  public deleteReserveProgram(program: Program): void {
    const reserveProgramsId = this.createReserveProgramsId()
    const index = reserveProgramsId.indexOf(program.id)
    if (index >= 0) this.reservePrograms.splice(index, 1)
  }
}
