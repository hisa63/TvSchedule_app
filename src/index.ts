import { TvScheduleCollect } from './lib/models/tvScheduleCollect.model'
import express from 'express'
import { Program } from './lib/models/program.model'
import { User } from './lib/models/user.model'

const app: express.Express = express()
app.use(express.json())

const tvScheduleCollect = new TvScheduleCollect()
const user = new User()
// tvScheduleCollect.createWeekSchedule()


//   vvvvv    teet     vvvvv


tvScheduleCollect.createWeekSchedule().then( () => {
  /**
   * 指定idの番組を取得
   */
  app.get('/programs/:id', (req, res) => {
    const id = Number(req.params.id)
    res.send(tvScheduleCollect.getProgram(id)?.toObject())
  })

  /**
   * 指定された日付の番組を取得
   */
  app.get('/programs', (req, res) => {
    const day = req.query.day

    for (let schedule of tvScheduleCollect.schedules) {
      if (schedule.day === Number(day)) {
        const programs = schedule.programs.map(program => program.toObject())
        res.send(programs)
        break
      }
    }
  })
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

  /**
   * keywordに該当する番組の取得、querystringで日付指定がある場合は指定された日付から該当する番組を取得
   */
  app.get('/search/programs/:keyword', (req,res) => {
    const keyword = req.params.keyword
    const day = req.query.day
    let reservePrograms: Program[] = []
    if (day === undefined) {
      reservePrograms = tvScheduleCollect.searchPrograms(keyword)
    } else {
      for (let schedule of tvScheduleCollect.schedules) {
        if (schedule.day === Number(day)) {
          reservePrograms = schedule.searchPrograms(keyword)
          break
        }
      }
    }
    res.send(reservePrograms.map(program => program.toObject()))
  })
  /**
   * 新規でkeywordを登録する
   */
  app.post('/users/:userId/keywords', (req, res) => {
    const id = req.params.id
    const keyword = req.params.keyword

    // userの配列からreq.params.idと一致するuserを取得
    //const user = getUser()
    user.createKeyword(keyword)
  })

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