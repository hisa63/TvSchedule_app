"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tvScheduleCollect_model_1 = require("./lib/models/tvScheduleCollect.model");
var tvScheduleCollect = new tvScheduleCollect_model_1.TvScheduleCollect();
tvScheduleCollect.initScheduleCollect();
//vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// import axios from 'axios'
// // import * as HTMLparse from 'fast-html-parser' 
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
// const _startProgramTime = 5
// // const allStationProgram = allList.querySelectorAll('.stationRate')
// const station = allList.querySelectorAll('.pgbox')
// // allStationProgram.forEach((station: any) => {
//   // station.querySelectorAll('.pgbox').forEach((program: any) => {
//   station.forEach((program: any) => {
//     const title = program.querySelector('.pheader .title').text
//     const detail = program.querySelector('p').text
//     let airTime = Math.round(Number(program.attributes.style.match(/(?<=height:).*(?=px;left)/)) / minHeight)
//     let aboutStartTime = _startProgramTime + Math.round(Number(program.attributes.style.match(/(?<=top:).*(?=px)/)) / minHeight) / 60
//     let startAirTime = Math.floor(aboutStartTime) + Math.round(aboutStartTime % Math.floor(aboutStartTime) * .6 * 100) / 100
//     console.log(`title: ${title}`)  // 番組名
//     console.log(`detail: ${detail}`) // 番組内容
//     console.log(`airTime: ${airTime}`) // 放送時間
//     console.log(`startAirTime: ${ startAirTime }`) // 放送開始時間
//     console.log('------------------------------------------------------------')
//   })
// })
// }
// main()
//# sourceMappingURL=index.js.map