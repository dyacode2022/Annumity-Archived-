const express = require('express');
const app = express();

var client = require('cheerio-httpcli');

var arr_title = new Array();
var arr_img = new Array();

let url = [];
url.push('http://anime.onnada.com/good.php?at=&date=&month=&rate=&ct=&ct2=&c=&q=&p=1');
url.push('http://anime.onnada.com/good.php?at=&date=&month=&rate=&ct=&ct2=&c=&q=&p=2');
url.push('http://anime.onnada.com/good.php?at=&date=&month=&rate=&ct=&ct2=&c=&q=&p=3');
var param = {};
let useUrl = '';


app.get("/", (req, res) => {
    for(let i = 0; i < 3; i++)
    {
        useUrl = url[i];
        client.fetch(useUrl, param, function(err, $, res) {
            if (err) {
                console.log(err);
                return;
            }
          
            $(".title").each(function(post) {
                arr_title.push($(this).text());
            });
            $(".img2").each(function(post) {
                arr_img.push($(this).attr('data-original'));
            });
                
        });

    }


    res.sendFile(__dirname + "/index.html"); // localhost로 들어가면 index.html을 보냄

});
app.get("/index", (req, res) => {
    res.sendFile(__dirname + "/index.html"); // localhost/index로 들어가면 index.html을 보냄
});
app.get("/index.html", (req, res) => {
    res.sendFile(__dirname + "/index.html"); // localhost/index.html로 들어가면 index.html을 보냄
});

app.get('/getTitles', (req, res) => {
    res.json({
        "titles": arr_title
    });
});
app.get('/getImages', (req, res) => {
    res.json({
        "images": arr_img
    });
});

app.use(express.static(__dirname))

app.listen(3000, () => console.log("localhost:3000 서버열림"));

