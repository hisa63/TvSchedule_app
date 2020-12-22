import { Program } from './program.model'
import { Keyword } from './keyword.model'
import { User } from './user.model'

export class Reservation {
  program: Program
  user: User
  constructor (program: Program, user: User) {
    this.program = program
    this.user = user
  }
}