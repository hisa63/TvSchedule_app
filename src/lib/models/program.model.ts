import { TvSchedule } from './tvSchedule.model'
import { Station } from './station.model'
import { Reservation } from './reservation.model'

export class Program {
  tvSchedule: TvSchedule 

  id: number
  title: string
  detail: string
  airTime: number
  startAirTime: number
  station: string

  constructor (tvSchedule: TvSchedule, id: number ,title: string, detail: string, airTime: number, startAirTime: number, station: string) {
    this.id = id
    this.title = title
    this.detail = detail
    this.airTime = airTime
    this.startAirTime = startAirTime
    this.tvSchedule = tvSchedule
    this.station = station
  }
}