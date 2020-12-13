"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//////////////////////////////////////////////////////
var axios_1 = __importDefault(require("axios"));
var HTMLparse = require('fast-html-parser');
var url = 'https://tver.jp/app/epg/23/2020-12-10/otd/true';
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, allList, allStationData, stations, _i, allStationData_1, station, timeNode, minHeight, _startProgramTime, allStationProgram;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get(url)]; // HTMLファイル取得
            case 1:
                data = _a.sent() // HTMLファイル取得
                ;
                allList = HTMLparse.parse(data.data) // HTMLパース
                ;
                allStationData = allList.querySelectorAll('.station');
                stations = [];
                for (_i = 0, allStationData_1 = allStationData; _i < allStationData_1.length; _i++) {
                    station = allStationData_1[_i];
                    stations.push(station.text.trim());
                }
                console.log(stations);
                console.log('-----------------');
                timeNode = String(allList.querySelector('.epgtime').attributes.style);
                minHeight = Math.round(Number(timeNode.match(/(?<=height:).*(?=px;)/)) / 1440 * 10) / 10 //1minあたりのpxを計算
                ;
                console.log("1minHeight: " + minHeight);
                _startProgramTime = 5;
                allStationProgram = allList.querySelectorAll('.stationRate');
                // const secondProgram: any[] = allStationProgram[0].querySelectorAll('.pgbox')
                allStationProgram.forEach(function (station) {
                    station.querySelectorAll('.pgbox').forEach(function (program) {
                        var title = program.querySelector('.pheader .title').text;
                        var detail = program.querySelector('p').text;
                        var airTime = Math.round(Number(program.attributes.style.match(/(?<=height:).*(?=px;left)/)) / minHeight);
                        var aboutStartTime = _startProgramTime + Math.round(Number(program.attributes.style.match(/(?<=top:).*(?=px)/)) / minHeight) / 60;
                        var startAirTime = Math.floor(aboutStartTime) + Math.round(aboutStartTime % Math.floor(aboutStartTime) * .6 * 100) / 100;
                        console.log("title: " + title); // 番組名
                        console.log("detail: " + detail); // 番組内容
                        console.log("airTime: " + airTime); // 放送時間
                        console.log("startAirTime: " + startAirTime); // 放送開始時間
                        console.log('------------------------------------------------------------');
                    });
                });
                return [2 /*return*/];
        }
    });
}); };
main();
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
//# sourceMappingURL=sample.js.map