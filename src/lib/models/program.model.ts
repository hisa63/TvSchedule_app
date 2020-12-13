import { TvSchedule } from './tvSchedule.model'
import { Station } from './station.model'

export class Program {
  tvSchedule: TvSchedule 

  title: string
  detail: string
  airTime: number
  startAirTime: number

  constructor (tvSchedule: TvSchedule ,title: string, detail: string, airTime: number, startAirTime: number) {
    this.title = title
    this.detail = detail
    this.airTime = airTime
    this.startAirTime = startAirTime
    this.tvSchedule = tvSchedule
  }
}