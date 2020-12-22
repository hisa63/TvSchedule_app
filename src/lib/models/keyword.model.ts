import { Reservation } from './reservation.model'
import { User } from './user.model'

export class Keyword {
  user: User
  keyword: string
  priority: number

  constructor (user: User, keyword: string, priority: number) {
    this.user = user
    this.keyword = keyword
    this.priority = priority
  }
}