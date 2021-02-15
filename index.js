console.log('hello world');

//imports
const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const port = 3000;

//static files
app.use(express.static('static/public'))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render ('home');
});

app.get('/recommendations', (req, res) => {
  res.render ('recommendations');
});

app.use (function (req, res, next) {
    res.status (404).send("no, this page is challas! ... sorry!")
    });
  
//listen
app.listen(3000, () => {
  console.log('Express web app on localhost:3000');
});


