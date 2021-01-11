import { Reservation } from './reservation.model'
import { User } from './user.model'

export class Keyword {
  id: string
  user: User
  keyword: string
  // priority: number

  constructor (id: string ,user: User, keyword: string) {
    this.id = id
    this.user = user
    this.keyword = keyword
    // this.priority = priority
  }

  public toObject() {
    return {
      id: this.id,
      user: this.user.id,
      keyword: this.keyword
    }
  } 
}