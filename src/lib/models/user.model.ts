import { Keyword } from './keyword.model'
import { Reservation } from './reservation.model'
import { Program } from './program.model'
import { NotFoundError } from '../errors'

type UserParams = {
  id?: string 
  name: string
}


export class User {
  id: string
  name: string
  keywords: Keyword[]
  reservePrograms: Reservation[]

  constructor(params: UserParams) {
    // this.id = "1"
    this.id = (params?.id) 
            ? params.id 
            : new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16)
    
    this.name = params.name
    this.keywords = []
    this.reservePrograms = []
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
  public createKeyword(inputWord: string): Keyword {
    let keyword = this.keywords.find(k => k.keyword === inputWord)
    if (!keyword) {
      const id = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16)
      keyword = new Keyword(id, this, inputWord)
      this.keywords.push(keyword)
      return keyword
    }
    throw new Error(`指定されたkeyword[${inputWord}]はすでに登録されています`)
  }
  /**
   * 入力されたwordをkeywordから削除する
   */
  public deleteKeyword(keywordId: string): Keyword {
    let deleteKeyword: Keyword
    const keywordsId = this.keywords.map(key => key.id)
    const index = keywordsId.indexOf(keywordId)
    if (index >= 0) {
      deleteKeyword = this.keywords[index]
      this.keywords.splice(index, 1)
      return deleteKeyword
    }
    throw new NotFoundError('指定されたkeywordは登録されていません')
  }
  /**
   * 指定された番組の予約を削除する
   */
  public deleteReserveProgram(reservationId: number): Reservation {
    const reserveProgramsId = this.createReserveProgramsId()
    const index = reserveProgramsId.indexOf(reservationId)

    let deleteReservation: Reservation
    if (index >= 0) {
      deleteReservation = this.reservePrograms[index] 
      this.reservePrograms.splice(index, 1)
      return deleteReservation
    }
    throw new NotFoundError('予約リストに指定された番組は存在しません')
  }
  /**
   * 指定された番組が既に予約されているか確認する
   */
  public isAlreadyReserved(id: number): boolean {
    const reserveProgramsId = this.createReserveProgramsId()
    return reserveProgramsId.indexOf(id) >= 0
  }
  /**
   * 指定された番組を予約する
   */
  public createReserveProgram(program: Program): Reservation {
    const reservation = new Reservation(program, this)
    this.reservePrograms.push(reservation) //reservePrograms -> reservations
    return reservation
  }
}
