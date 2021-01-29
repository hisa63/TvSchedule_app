import { TvSchedule } from './tvSchedule.model'

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

  public toObject() {
    return {
      id: this.id,
      station: this.station,
      title: this.title,
      detail: this.detail,
      airTime: this.airTime,
      startAirTime: this.startAirTime
    }
  }
}
