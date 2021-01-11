import { Keyword } from './keyword.model'
import { TvScheduleCollect } from './tvScheduleCollect.model'
import { Reservation } from './reservation.model'
import { Program } from './program.model'

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
  public createKeyword(inputWord: string): Keyword | null {
    let keyword: Keyword | null =  null
    if (!this.hasKeyword(inputWord)) {
      const id = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16)
      keyword = new Keyword(id, this, inputWord)
      this.keywords.push(keyword)
    }
    return keyword
  }
  /**
   * 入力されたwordをkeywordから削除する
   */
  public deleteKeyword(inputWord: string): void {
    const words = this.keywords.map(key => { return key.keyword })
    const index = words.indexOf(inputWord)
    if (index >= 0) this.keywords.splice(index, 1)
  }
  // /**
  //  * 予約一覧に指定された番組がなければ予約をする
  //  */
  // public createReserveProgram(program: Program): Reservation {
  //   const reserveProgramsId = this.createReserveProgramsId()
  //   if (reserveProgramsId.indexOf(program.id) < 0) {
  //     const reservation = new Reservation(program, this)
  //     this.reservePrograms.push(reservation)
  //     return reservation
  //   }
  //   throw new Error('指定された番組はすでに予約されています')
  // }
  /**
   * 指定された番組の予約を削除する
   */
  public deleteReserveProgram(reservationId: number): Reservation | undefined {
    const reserveProgramsId = this.createReserveProgramsId()
    const index = reserveProgramsId.indexOf(reservationId)

    let deleteReservation: Reservation | undefined
    if (index >= 0) {
      deleteReservation = this.reservePrograms[index] 
      this.reservePrograms.splice(index, 1)
    } else {
      deleteReservation = undefined
    }
    return deleteReservation
  }
  /**
   * テスト
   */
  public isAlreadyReserved(id: number): boolean {
    const reserveProgramsId = this.createReserveProgramsId()
    return reserveProgramsId.indexOf(id) >= 0
  }
  public createReserveProgram(program: Program): Reservation {
    const reservation = new Reservation(program, this)
    this.reservePrograms.push(reservation) //reservePrograms -> reservations
    return reservation
  }





  
  public testDeleteProgram(id: number): void {
    const reserveProgramsId = this.createReserveProgramsId()
    const index = reserveProgramsId.indexOf(id)
    if (index >= 0) this.reservePrograms.splice(index, 1)
  }
}
