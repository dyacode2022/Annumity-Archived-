const path = require('path').resolve() // __dirname은 더이상 표준이 아님
const express = require('express')
const { renderFile: render } = require('ejs') // 렌더러
const { get } = require('superagent') // 사이트 요청 하는거
const cheerio = require('cheerio') // 크롤링 하는거

// 혹시 나중에 url이 바뀔때를 대비해서
const baseurl = 'http://anime.onnada.com/good.php?at=&date=&month=&rate=&ct=&ct2=&c=&q=&p='
const app = express()

let data
refresh()
setInterval(refresh, 100000)

async function refresh () {
  data = []
  for (let i = 0; i < 3; i++) {
    // 웹 페이지 불러오기
    const html = (await get(baseurl + i)).text

    // 크롤러에 로드
    const cheer = cheerio.load(html)

    // 크롤링 결과
    const titles = cheer('.title').slice(8) // 제목들
    const images = cheer('.img2') // 썸내일들
    const count = cheer('.thumb').length // 총 개수

    // 각 애니마다
    for (let j = 0; j < count; j++) {
      if (!cheer(images[j]).attr('data-original')) continue // 사진이 없으면 버려!
      data.push({ title: cheer(titles[j]).text(), image: cheer(images[j]).attr('data-original') }) // data에 제목과 썸내일을 넣기
    }
  }
}

app.get('/', (_, res) => {
  // 렌더링
  render(path + '/page/index.ejs', { data }, (err, str) => {
    if (err) console.log(err)
    res.send(str) // 렌더링 완료후 전송
  })
})

app.use('/src', express.static(path + '/src')) // css, script 같은거
app.use((_, res) => res.send('잘못 오셨습니다!<script>window.location.replace(\'/\')</script>')) // 404 메세지
app.listen(3000, () => console.log('http://localhost:3000 서버열림')) // 열기
