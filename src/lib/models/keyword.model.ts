import { Reservation } from './reservation.model'
import { User } from './user.model'

export class KeyWord {
  user: User
  keyWord: string[]

  constructor (user: User) {
    this.user = user
    this.keyWord = ['クイズ', '天才', '動物']
  }
}