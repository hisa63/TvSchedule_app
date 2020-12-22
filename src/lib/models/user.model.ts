import { Keyword } from './keyword.model'
import { TvScheduleCollect } from './tvScheduleCollect.model'
import { Reservation } from './reservation.model'

export class User {
  id: number
  name: string

  constructor () {
    this.id = 1
    this.name = 'hisa'
  }

  public scanKeyword():void {
    let shudReservePrograms: string[] = []  //  program[]
    shudReservePrograms.forEach(program => {
      // new Reservation(program, this)
    })
  }
}