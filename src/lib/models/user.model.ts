import { Keyword } from './keyword.model'
import { TvScheduleCollect } from './tvScheduleCollect.model'
import { Reservation } from './reservation.model'

export class User {
  id: number
  name: string
  keywords: Keyword[]

  constructor () {
    this.id = 1
    this.name = 'hisa'
    this.keywords = []
  }

  // public scanKeyword():void {
  //   let shudReservePrograms: string[] = []  //  program[]
  //   shudReservePrograms.forEach(program => {
  //     // new Reservation(program, this)
  //   })
  // }
  /**
   * keywordがすでに登録されているか確認する
   */
  private hasKeyword(inputWord: string): boolean {
    for (let key of this.keywords) {
      if (key.keyword === inputWord)
        return true
    }
    return false
  }
  /**
   * 入力されたwordをkeywordに登録する 
   */
  public createKeyword(inputWord: string, priority: number): void {
    if (this.hasKeyword(inputWord) === false)
      this.keywords.push(new Keyword(this, inputWord, priority))
  }
  /**
   * 入力されたwordをkeywordから削除する
   */
  public deleteKeyword(inputWord: string): void {
    const words = this.keywords.map(key => { return key.keyword })
    const index = words.indexOf(inputWord)
    if (index >= 0) {
      this.keywords.splice(index, 1)
    } 
  }
}