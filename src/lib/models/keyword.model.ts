import { User } from './user.model'

export class Keyword {
  id: string
  user: User
  keyword: string

  constructor (user: User, keyword: string) {
    this.id = new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16)
    this.user = user
    this.keyword = keyword
  }

  public toObject() {
    return {
      id: this.id,
      user: this.user.id,
      keyword: this.keyword
    }
  } 
}