console.log('hello world');

//imports
const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const port = 3000;

//test
const accounts = [
  {name: "drake", age: "34", location: "4.5 km away"},
  {name: "abel", age: "31", location: "5 km away"},
  {name: "bryson", age: "28", location: "8 km away"}
];
//static files
app.use(express.static('public'))

//dynamic data
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({ 
  defaultLayout: 'main',}));


app.get('/', (req, res) => {
  res.render ('home');
});

app.get('/recommendations', (req, res) => {
  res.render ('recommendations',{title:"Een lijst met accounts", accounts});
});

app.get('/user profile', (req, res) => {
  res.render ('userprofile');
});

app.use (function (req, res, next) {
    res.status (404).send("no, this page is challas! ... sorry!")
    });
  
//listen
app.listen(3000, () => {
  console.log('Express web app on localhost:3000');
});


