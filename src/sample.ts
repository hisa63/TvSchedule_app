//////////////////////////////////////////////////////
import axios from 'axios'

const HTMLparse = require('fast-html-parser')
const url = 'https://tver.jp/app/epg/23/2020-12-10/otd/true'

const main = async () => {
  const data = await axios.get(url) // HTMLファイル取得
  const allList = HTMLparse.parse(data.data)  // HTMLパース

  // テレビ局を取得
  const allStationData = allList.querySelectorAll('.station')
  let stations: string[] = []

  for (let station of allStationData) {
    stations.push(station.text.trim())
  }  
  console.log(stations)
  console.log('-----------------')

  const timeNode = String(allList.querySelector('.epgtime').attributes.style)
  const minHeight: number = Math.round(Number(timeNode.match(/(?<=height:).*(?=px;)/)) / 1440 * 10) / 10   //1minあたりのpxを計算
  console.log(`1minHeight: ${minHeight}`)

  // 各局ごとの番組を取得
  const _startProgramTime = 5
  const allStationProgram = allList.querySelectorAll('.stationRate')
  // const secondProgram: any[] = allStationProgram[0].querySelectorAll('.pgbox')
  allStationProgram.forEach((station: any) => {
    station.querySelectorAll('.pgbox').forEach((program: any) => {
      const title = program.querySelector('.pheader .title').text
      const detail = program.querySelector('p').text
      let airTime = Math.round(Number(program.attributes.style.match(/(?<=height:).*(?=px;left)/)) / minHeight)
      let aboutStartTime = _startProgramTime + Math.round(Number(program.attributes.style.match(/(?<=top:).*(?=px)/)) / minHeight) / 60
      let startAirTime = Math.floor(aboutStartTime) + Math.round(aboutStartTime % Math.floor(aboutStartTime) * .6 * 100) / 100
      console.log(`title: ${title}`)  // 番組名
      console.log(`detail: ${detail}`) // 番組内容
      console.log(`airTime: ${airTime}`) // 放送時間
      console.log(`startAirTime: ${ startAirTime }`) // 放送開始時間
      console.log('------------------------------------------------------------')
    })
  })
}

main()


 //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  pre   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



// promise

// let anchorTime = (new Date()).getTime()

// const getTime = () => {
//   const now = (new Date()).getTime()
//   console.log(`${now - anchorTime} milliseconds elapsed`)
//   anchorTime = now
// }




// const axios = require("axios")
// const url = "https://tver.jp/app/epg/23/2020-12-9/otd/true"

// getTime()
// axios.get(url)
//   .then((result: any) => {
//     console.log('success')
//     getTime()
//     axios.get('https://tver.jp/app/epg/23/2020-12-10/otd/true')    
//       .then((result: any) => {
//         console.log('success2')
//         getTime()
//       })
//       .catch((error: any) => {
//         console.log('error2')
//         getTime()
//       })
//       .finally(() => {
//         console.log('finally2')
//         getTime()
//       })    
//     console.log('xxxxxx')
//   })
//   .catch((error: any) => {
//     console.log('error')
//     getTime()
//   })
//   .finally(() => {
//     console.log('finally')
//     getTime()
//   })


// const axios = require("axios")
// import axios from 'axios'
// const main = (): Promise<void> => {
//   return new Promise<void>((resolve, reject) => {
//     getTime()
//     axios.get('https://tver.jp/app/epg/23/2020-12-09/otd/true')
//     .then((result) => {
//       getTime()
//       resolve()
//   })
//     .catch(() => {
//       reject()
//     })
//   })
// }

// const main2 = async () => {
//   const promises: Promise<void>[] = []
//   getTime()
//   for(let j = 0; j < 20; j++) {
//     for (let i = 0; i< 5; i++) {
//       console.log(`adding ${ j * 5 + i}th promise...`)
//       promises.push(axios.get('https://tver.jp/app/epg/23/2020-12-09/otd/true'))
//     }  
//     await Promise.all(promises)
//   }
//   getTime()
  
// }



// main2()
// .then(() => {
//   console.log('promise fulfilled!')
// })
// .catch(() => {
//   console.log('rejected!')
// })


// //////////////////////////////////////////////////////
// import axios from 'axios'

// const HTMLparse = require('fast-html-parser')
// const url = 'https://tver.jp/app/epg/23/2020-12-10/otd/true'

// const main = async () => {
//   const data = await axios.get(url) // HTMLファイル取得
//   const allList = HTMLparse.parse(data.data)  // HTMLパース

//   // テレビ局を取得
//   const allStationData = allList.querySelectorAll('.station')
//   let stations: string[] = []

//   for (let station of allStationData) {
//     stations.push(station.text.trim())
//   }  
//   console.log(stations)
//   console.log('-----------------')

//   const timeNode = String(allList.querySelector('.epgtime').attributes.style)
//   const minHeight: number = Math.round(Number(timeNode.match(/(?<=height:).*(?=px;)/)) / 1440 * 10) / 10   //1minあたりのpxを計算
//   console.log(`1minHeight: ${minHeight}`)

//   // 各局ごとの番組を取得
//   const _startProgramTime = 5
//   const allStationProgram = allList.querySelectorAll('.stationRate')
//   // const secondProgram: any[] = allStationProgram[0].querySelectorAll('.pgbox')
//   allStationProgram.forEach((station: any) => {
//     station.querySelectorAll('.pgbox').forEach((program: any) => {
//       const title = program.querySelector('.pheader .title').text
//       const detail = program.querySelector('p').text
//       let airTime = Math.round(Number(program.attributes.style.match(/(?<=height:).*(?=px;left)/)) / minHeight)
//       let aboutStartTime = _startProgramTime + Math.round(Number(program.attributes.style.match(/(?<=top:).*(?=px)/)) / minHeight) / 60
//       let startAirTime = Math.floor(aboutStartTime) + Math.round(aboutStartTime % Math.floor(aboutStartTime) * .6 * 100) / 100
//       console.log(`title: ${title}`)  // 番組名
//       console.log(`detail: ${detail}`) // 番組内容
//       console.log(`airTime: ${airTime}`) // 放送時間
//       console.log(`startAirTime: ${ startAirTime }`) // 放送開始時間
//       console.log('------------------------------------------------------------')
//     })
//   })
// }

// main()


//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  pre   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^



// promise

// let anchorTime = (new Date()).getTime()

// const getTime = () => {
//   const now = (new Date()).getTime()
//   console.log(`${now - anchorTime} milliseconds elapsed`)
//   anchorTime = now
// }




// const axios = require("axios")
// const url = "https://tver.jp/app/epg/23/2020-12-9/otd/true"

// getTime()
// axios.get(url)
//   .then((result: any) => {
//     console.log('success')
//     getTime()
//     axios.get('https://tver.jp/app/epg/23/2020-12-10/otd/true')    
//       .then((result: any) => {
//         console.log('success2')
//         getTime()
//       })
//       .catch((error: any) => {
//         console.log('error2')
//         getTime()
//       })
//       .finally(() => {
//         console.log('finally2')
//         getTime()
//       })    
//     console.log('xxxxxx')
//   })
//   .catch((error: any) => {
//     console.log('error')
//     getTime()
//   })
//   .finally(() => {
//     console.log('finally')
//     getTime()
//   })


// const axios = require("axios")
// import axios from 'axios'
// const main = (): Promise<void> => {
//   return new Promise<void>((resolve, reject) => {
//     getTime()
//     axios.get('https://tver.jp/app/epg/23/2020-12-09/otd/true')
//     .then((result) => {
//       getTime()
//       resolve()
//   })
//     .catch(() => {
//       reject()
//     })
//   })
// }

// const main2 = async () => {
//   const promises: Promise<void>[] = []
//   getTime()
//   for(let j = 0; j < 20; j++) {
//     for (let i = 0; i< 5; i++) {
//       console.log(`adding ${ j * 5 + i}th promise...`)
//       promises.push(axios.get('https://tver.jp/app/epg/23/2020-12-09/otd/true'))
//     }  
//     await Promise.all(promises)
//   }
//   getTime()
  
// }



// main2()
// .then(() => {
//   console.log('promise fulfilled!')
// })
// .catch(() => {
//   console.log('rejected!')
// })






  // let flag = true
  // while (flag) {
  //   const prompt = require('prompt-sync')()
  //   const keyword = prompt('keywordを入力してください: ') as string
  //   let shudReservePrograms = tvScheduleCollect.searchPrograms(keyword)
  //   shudReservePrograms.forEach(program => {
  //     let day = new Date(program.startAirTime * 1000)
  //     console.log(`--------------------------`)
  //     console.log(`date: ${program.tvSchedule.month}月 ${day.getDate()}日 : ${day.getHours()}:${day.getMinutes()}〜`)
  //     console.log(`title: ${program.title}`)
  //     console.log(`detail: ${program.detail}`)
  //     console.log(`id: ${program.id}`)
  //     console.log(`airTime: ${program.airTime}`)
  //   })
  //   if (keyword === 'fin') flag = false
  // }
