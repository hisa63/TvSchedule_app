import express from 'express'
import bodyParser from 'body-parser'
import moment from 'moment'
import { TvScheduleCollect } from './lib/models/tvScheduleCollect.model'
import { TvSchedule } from './lib/models/tvSchedule.model'
import { Program } from './lib/models/program.model'
import { User } from './lib/models/user.model'

type Reservation = {
  id: string,
  program_id: number,
  user_id: string
}

const app: express.Express = express()
app.use(express.json())
app.use(bodyParser.json())

const tvScheduleCollect = new TvScheduleCollect()
const users = [new User({ 
  id: '1',
  name: 'hisa'
})]


tvScheduleCollect.createWeekSchedule().then( () => { 
  /**
   * keywordに該当する番組の取得、querystringで日付指定がある場合は指定された日付から該当する番組を取得
   */
  app.get('/programs', (req, res) => {
    try {
      const keyword = req.query.keyword as string | undefined
      const date = req.query.date as string | undefined
      let reservePrograms: Program[] = []
      let schedule: TvSchedule | null | undefined = undefined

      if (date) {
        const dateParsed = moment(date, 'YYYY-MM-DD', true)
        console.log(`dateParsed`)
        if (!dateParsed.isValid()) throw new Error('日付を正しく入力してください　ex)YYYY-MM-DD')
        schedule = tvScheduleCollect.getSpecifiedSchedule(dateParsed)
        if (schedule === null) throw new Error('指定された日付の番組表は存在しません')

        if (keyword) reservePrograms = schedule.searchPrograms(keyword)
        else reservePrograms = schedule.programs
      } else {
        if (keyword) reservePrograms = tvScheduleCollect.searchPrograms(keyword)
        else reservePrograms = tvScheduleCollect.programs
      }
      res.status(200)
      res.send(reservePrograms.map(program => program.toObject()))
    } catch (error) {
      res.status(400)
      res.send({error: error.message})
    }
  })
  /**
   * 指定idの番組を取得
   */
  app.get('/programs/:id', (req, res) => {
    try {
      const id = Number(req.params.id)
      const program = tvScheduleCollect.programs.find(p => p.id === id)

      if (!id) throw new Error(``)
      res.send(tvScheduleCollect.getProgram(id)?.toObject())
    } catch (error) {

    }
  })
  /**
   * 予約する番組を取得
   */
  // app.get('/reservations', (req, res) => {
  //   const reservePrograms = user.reservePrograms.map(program => program.program.toObject())
  //   res.send(reservePrograms)
  // })
  /**
   * 番組を予約する
   */
  app.post('/reservations', (req, res) => { //testです

    try {
      const reservation = req.body as Reservation
      
      // error checkをしてください       
      if (!reservation.program_id) throw new Error('program_idを指定してください')
      if (!reservation.user_id) throw new Error('user_idを指定してください')
      
      const user = users.find(u => u.id === reservation.user_id)
      if (!user) throw new Error(`user_id ${reservation.user_id}は存在しません`)
      if (user.isAlreadyReserved(reservation.program_id)) throw new Error(`${reservation.program_id} はすでに予約されています`)

      const program = tvScheduleCollect.programs.find(p => p.id === reservation.program_id)
      if (!program) throw new Error(`program_id ${reservation.program_id}は存在しません`)
  
      const newReservation = user.createReserveProgram(program)
      res.status(200)
      res.send(newReservation.toObject())      
    } catch (error) {
      res.status(400)
      res.send({error: error.message})
    }
  })
  // app.post('/users/:userId/programs/:programId/reserves', (req, res) => {
  //   const program = req.params.program
  //   user.createReserveProgram(Number(program))
  // })

  /**
   * 予約番組を削除する
   */
  // app.delete('/reservations/:reservationId', (req, res) => {
  //   const programId = req.params.programId
  //   user.testDeleteProgram(Number(programId))
  //   res.send(programId)
  // })

  /**
   * 新規でkeywordを登録する
   */
  // app.post('/keywords', (req, res) => {
  //   const id = req.params.id
  //   const keyword = req.params.keyword

  //   // userの配列からreq.params.idと一致するuserを取得
  //   //const user = getUser()
  //   user.createKeyword(keyword)
  // })
  /**
   * 該当するkeywordを削除
   */
  // app.delete('/keywords/:keywordId', (req, res) => {
  //   const keyword = req.params.keyword
  //   user.deleteKeyword(keyword)
  //   res.send(keyword)
  // })

  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Listening on port ${port}...`))
})
