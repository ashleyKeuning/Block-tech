console.log('hello world');

const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('static/public'))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get ('/recommendations', (req, res) => {
res.send('todays recommendations')
});

app.get ('/recommendations/:recId', (req, res) => {
  res.send(`<h1>detail of todays recommendation ${req.params.recId}</h1>`)
  });

app.use (function (req, res, next) {
    res.status (404).send("no, this page is challas! ... sorry!")
    });
  

app.listen(3000, () => {
  console.log('Express web app on localhost:3000');
});


