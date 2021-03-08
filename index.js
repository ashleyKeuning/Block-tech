console.log('hello world');

// Imports
const express = require('express');
const dotenv = require('dotenv').config();

// tussen de curly brackets wordt het object
const { MongoClient } = require('mongodb');

const app = express();
const exphbs = require('express-handlebars');

const port = 3000;

// static files
const accounts = [
  {
    id: 'acc1',
    firstName: 'naam',
    lastName: 'achternaam',
    age: '20',
    location: '4.5 km',
  },
];

// saved profielen pagina
const profielen = [
  {
    id: 'acc1',
    firstName: 'naam',
    lastName: 'achternaam',
    age: '20',
    location: '4.5 km',
  },
];

/*
 * database codes
 *  test voor database
 */
console.log(process.env.TESTVAR);

// Test
const db = null;
// function conncectDB
async function connectDB() {
  // get URI from .env file
  const uri = process.env.DB_URI;
  // make connection to database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options);
  await client.connect();
  db = await client.db(process.env.DB_NAME);
}

connectDB()
  .then(() => {
    // if succesful connection is made show a message
    console.log('there is a connection');
  })
  .catch((error) => {
    // if connection is unsuccesful, show errors
    console.log(error);
  });
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
app.get('', (req, res) => {
  res.render('home');
});

// Recommendations pagina (de feature)
app.get('/recommendations', (req, res) => {
  res.render('recommendations', {
    title: 'Een lijst met accounts',
    accounts,
  });
});

app.get('/savedprofiles', (req, res) => {
  res.render('userprofile', {
    title: 'opgeslagen accounts',
    profielen,
  });
});

app.get('/chat', (req, res) => {
  res.render('chat', {
    title: 'chats',
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
