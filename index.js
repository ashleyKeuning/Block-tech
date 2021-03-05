console.log('hello world');

// Imports
const express = require('express');
const dotenv = require('dotenv').config();

const app = express();
const exphbs = require('express-handlebars');

const port = 3000;

console.log(process.env.TESTVAR);
// Test
const accounts = [
  {
    id: 'acc1',
    firstName: 'naam',
    lastName: 'achternaam',
    age: '20',
    location: '4.5 km',
  },
];

// Static files
app.use(express.static('public'));

// Dynamic data
app.set('view engine', 'handlebars');
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
  }),
);

// Homepagina(deze bestaat dan niet)
app.get('/', (req, res) => {
  res.render('...');
});

// Recommendations pagina (de feature)
app.get('/recommendations', (req, res) => {
  res.render('recommendations', {
    title: 'Een lijst met accounts',
    accounts,
  });
});

/*
 * Pagina om meer details van de profiel te kunnen zien
 * (idk of het een nieuwe pagina wordt of een progressive disclosure gebeurende gaat worden)
 * app.get('/userprofile', (req, res) => {
 * res.render ('userprofile');
 * });
 */

// Error pagina
app.use((req, res, next) => {
  res.status(404).send('no, this page is challas! ... sorry!');
});

// Listen
app.listen(3000, () => {
  console.log('Express web app on localhost:3000');
});
