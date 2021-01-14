import express from 'express'
import bodyParser from 'body-parser'
import moment from 'moment'
import { TvScheduleCollect } from './lib/models/tvScheduleCollect.model'
import { TvSchedule } from './lib/models/tvSchedule.model'
import { Program } from './lib/models/program.model'
import { User } from './lib/models/user.model'
import { NotFoundError } from './lib/errors'

type Reservation = {
  id: string,
  program_id: number,
  user_id: string
}

type Keyword = {
  id: string,
  user_id: string,
  keyword: string
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

      if (date) {
        const dateParsed = moment(date, 'YYYY-MM-DD', true)
        if (!dateParsed.isValid()) throw new Error('日付を正しく入力してください　ex)YYYY-MM-DD')
        const schedule = tvScheduleCollect.getSpecifiedSchedule(dateParsed)

        //// case 1
        if (keyword) {
          reservePrograms = schedule.searchPrograms(keyword)
          if (!reservePrograms.length) throw new NotFoundError(`指定されたkeyword:[${keyword}]に該当する番組はありませんでした`)
        } else {
          reservePrograms = schedule.programs
        }
        //// case 2
        if (keyword) reservePrograms = schedule.searchPrograms(keyword)
        else reservePrograms = schedule.programs
        if (!reservePrograms.length) throw new NotFoundError(`指定されたkeyword:[${keyword}]に該当する番組はありませんでした`)
        ////
      } else {
        if (keyword) reservePrograms = tvScheduleCollect.searchPrograms(keyword)
        else reservePrograms = tvScheduleCollect.programs
      }
      res.status(200)
      res.send(reservePrograms.map(program => program.toObject()))
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404)
        res.send({ error: e.message })
      } else {
        res.status(400)
        res.send({error: e.message})
      }
    }
  })
  /**
   * 指定idの番組を取得
   */
  app.get('/programs/:programs_id', (req, res) => {
    try {
      const id = Number(req.params.programs_id)
      if (isNaN(id)) throw new Error('id番号を入力してください')
      
      const program = tvScheduleCollect.programs.find(p => p.id === id)
      if (!program) throw new NotFoundError('該当する番組が見つかりませんでした')
      
      res.status(200)
      res.send(program.toObject())
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404)
        res.send({ error: e.message })
      } else {
        res.status(400)
        res.send({ error: e.message })
      }
    }
  })
  /**
   * 予約する番組を取得
   */
  app.get('/reservations', (req, res) => {
    try {
      const userId = req.query.user_id as string | undefined
      if (!userId) throw new Error(`user_idを指定してください`)
      if (isNaN(Number(userId))) throw new Error(`指定されたuser_id: ${userId}は無効です`)
      const user = users.find(u => u.id === userId)
      if (!user) throw new NotFoundError(`指定されたuserは存在しません`)

      const reservePrograms = user.reservePrograms
      res.status(200)
      res.send(reservePrograms.map(program => program.program.toObject()))
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404)
        res.send({ error: e.message })
      } else {
        res.status(400)
        res.send({ error: e.message })
      }
    }
  }) 
  /**
   * 番組を予約する
   */
  app.post('/reservations', (req, res) => {
    try {
      const reservation = req.body as Reservation
      
      if (!reservation.program_id) throw new Error('program_idを指定してください')
      if (!reservation.user_id) throw new Error('user_idを指定してください')
      
      const user = users.find(u => u.id === reservation.user_id)
      if (!user) throw new NotFoundError(`user_id ${reservation.user_id}は存在しません`)
      if (user.isAlreadyReserved(reservation.program_id)) throw new Error('指定された番組はすでに予約されています')

      const program = tvScheduleCollect.programs.find(p => p.id === reservation.program_id)
      if (!program) throw new NotFoundError('指定された番組は存在しません')
  
      const newReservation = user.createReserveProgram(program)
      res.status(201)
      res.send(newReservation.toObject())      
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404)
        res.send({ error: e.message })
      } else {
        res.status(400)
        res.send({error: e.message})
      }
    }
  })
  /**
   * 予約番組を削除する
   */
  app.delete('/reservations/:reservation_id', (req, res) => {
    try {
      const userId = req.query.user_id as string | undefined
      const reservationId = req.params.reservation_id

      if (!userId) throw new Error('user_idを指定してください')
      const user = users.find(u => u.id === userId)
      if (!user) throw new NotFoundError(`user_id:${userId}は存在しません`)
      if (isNaN(Number(reservationId))) throw new Error('無効なidです')

      const deleteReservation = user.deleteReserveProgram(Number(reservationId))
      res.status(200)
      res.send({ reservation_id: deleteReservation.id })
    } catch (e) {
      if (e instanceof NotFoundError) { // a instanceof b --> aはbから派生しているかどうか？
        res.status(404)
        res.send({ error: e.message })
      } else {
        res.status(400)
        res.send({ error: e.message })
      }
    }
  })
  /**
   * keywordを取得する
   */
  app.get('/keywords', (req, res) => {
    try {
      const userId = req.query.user_id as string | undefined
      if (!userId) throw new Error('user_idを入力してください')
      const user = users.find(u => u.id === userId)
      if (!user) throw new NotFoundError('指定されたuserは存在しません')

      const keywords = user.keywords
      if (!keywords.length) throw new NotFoundError('keywordは登録されていません') 
      res.status(200)
      res.send(keywords.map(keyword => keyword.toObject()))
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404)
        res.send({ error: e.message })
      } else {
        res.status(400)
        res.send({ error: e.message })
      } 
    }
  })
  /**
   * 新規でkeywordを登録する
   */
  app.post('/keywords', (req, res) => {
    try {
      const keyParams = req.body as Keyword
      if (!keyParams.user_id) throw new Error('user_idを指定してください')
      const user = users.find(u => u.id === keyParams.user_id)
      if (!user) throw new NotFoundError('指定されたuserは存在しません')
      if (!keyParams.keyword) throw new Error('keywordを入力してください')
      if (keyParams.keyword.match(/\s/g)) throw new Error('keywordに空白などの空白文字を使用しないでください')

      const keyword = user.createKeyword(keyParams.keyword)
      res.status(201)
      res.send({ keyword_id: keyword.id })
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404)
        res.send({ error: e.message })
      } else {
        res.status(400)
        res.send({ error: e.message })
      }
    }
  })
  /**
   * 該当するkeywordを削除
   */
  app.delete('/keywords/:keywordId', (req, res) => {
    try {
      const userId = req.query.user_id as string | undefined
      if (!userId) throw new Error('user_idを指定してください')
      const user = users.find(u => u.id === userId)
      if (!user) throw new NotFoundError('指定されたuserは存在しません')

      const keywordId = req.params.keywordId
      const deleteKeyword = user.deleteKeyword(keywordId)
      res.status(200)
      res.send({ keyword_id: deleteKeyword.id })
    } catch (e) {
      if (e instanceof NotFoundError) {
        res.status(404)
        res.send({ error: e.message })
      } else {
        res.status(400)
        res.send({ error: e.message })
      }        
    }
  })

  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Listening on port ${port}...`))
})
