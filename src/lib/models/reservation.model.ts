import { Program } from './program.model'
import { User } from './user.model'

export class Reservation {
  id: string
  program: Program
  user: User
  constructor (program: Program, user: User) {
    this.id =　new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16)
    this.program = program
    this.user = user
  }

  public toObject() {
    return {
      id: this.id,
      program: this.program.id,
      program_title: this.program.title,
      user_id: this.user.id
    }
  }
}