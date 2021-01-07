import express from 'express'
import bodyParser from 'body-parser'
import { TvScheduleCollect } from './lib/models/tvScheduleCollect.model'
import { Program } from './lib/models/program.model'
import { User } from './lib/models/user.model'

export type Reservation = {
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
    const keyword = req.query.keyword
    const day = req.query.day
    let reservePrograms: Program[] = []
    if (day === undefined) {
      if (keyword !== undefined) reservePrograms = tvScheduleCollect.searchPrograms(String(keyword))
      else reservePrograms = tvScheduleCollect.programs
    } else {
      for (let schedule of tvScheduleCollect.schedules) {
        if (schedule.day === Number(day)) {
          if (keyword !== undefined) reservePrograms = schedule.searchPrograms(String(keyword))
          else reservePrograms = schedule.programs
          break
        }
      }
    }
    res.send(reservePrograms.map(program => program.toObject()))
  })
  /**
   * 指定idの番組を取得
   */
  app.get('/programs/:id', (req, res) => {
    const id = Number(req.params.id)
    res.send(tvScheduleCollect.getProgram(id)?.toObject())
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



//   ^^^^^    test    ^^^^^

  // if (keyword === undefined) {
  //   const allPrograms = tvScheduleCollect.programs.map(program => program.toObject())
  //   res.send(allPrograms)
  // } else {
  //   const hitPrograms = tvScheduleCollect.searchPrograms(String(keyword))
  //   const reservePrograms = hitPrograms.map(program => program.toObject())
  //   res.send(reservePrograms)
  // }





  // /**
  //  * querystringのkeyがdayならその日の番組を、keywordならmatchした番組を取得
  //  */
  // app.get('/programs', (req, res) => {
  //   const keyword = req.query.keyword
  //   const day = req.query.day

  //   if (day) {
  //     for (let schedule of tvScheduleCollect.schedules) {
  //       if (schedule.day === Number(day)) {
  //         const programs = schedule.programs.map(program => program.toObject())
  //         res.send(programs)
  //         break
  //       } 
  //     }
  //   } else if (keyword) {
  //     const hitPrograms = tvScheduleCollect.searchPrograms(String(keyword))
  //     const reservePrograms = hitPrograms.map(program => program.toObject())
  //     res.send(reservePrograms)
  //   }
  // })

  // /**
  //  * 指定された日付の番組を取得
  //  */
  // app.get('/programs', (req, res) => {
  //   const keyword = req.query.keyword 
  //   const day = req.query.day

  //   if (keyword) {
  //     // きーわーどが含まれているプログラムにしぼる
  //   } 

  //   if (day) {
  //     // 日付でさらにしぼる
  //   }



  //   console.log('check')

  //   for (let schedule of tvScheduleCollect.schedules) {
  //     if (schedule.day === Number(day)) {
  //       const programs = schedule.programs.map(program => program.toObject())
  //       res.send(programs)
  //       break
  //     }
  //   }
  // })