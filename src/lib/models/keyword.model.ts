import { Reservation } from './reservation.model'

export class KeyWord {
  user: number
  keyWord: string[]

  constructor (user: number) {
    this.user = user
    this.keyWord = []
  }
}