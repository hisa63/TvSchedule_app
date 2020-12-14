import { Program } from './program.model'
import { KeyWord } from './keyword.model'

export class Reservation {
  program: Program
  keyWord: string
  constructor (program: Program, keyWord: string) {
    this.program = program
    this.keyWord = keyWord
  }
}