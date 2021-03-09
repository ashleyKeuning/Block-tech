// Imports
const express = require('express');
const bodyParser = require('body-parser');

// database
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');

// tussen de curly brackets wordt het object

const app = express();
const exphbs = require('express-handlebars');

const port = 3000;

// test voor database

console.log(process.env.TESTVAR);

/*
 * static files
 * const accounts = [
 *   {
 *     id: 'acc1',
 *     firstName: 'naam',
 *     lastName: 'achternaam',
 *     age: '20',
 *     location: '4.5 km',
 *   },
 * ];
 */

// saved profielen pagina
const profielen = [
  {
    id: '',
    firstName: '',
    lastName: '',
    age: '',
    location: '',
  },
];

let db = null;
let likesCollection = null;
let profileCollection = null;

// function conncectDB
async function connectDB() {
  // get URI from .env file
  const uri = process.env.DB_URI;
  // make connection to database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options);
  await client.connect();
  db = await client.db(process.env.DB_NAME);
  likesCollection = await db.collection('likes');
  profileCollection = await db.collection('profiel');
}

connectDB()
  .then(() => {
    // if succesful connection is made show a message
    console.log('we have a connection to mongo!');
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
app.use(bodyParser.urlencoded({ extended: false }));

// Homepagina(deze bestaat dan niet)
app.get('', (req, res) => {
  res.render('home');
});

// Recommendations pagina (de feature)
app.get('/recommendations', async (req, res) => {
  const objectID = new ObjectID('6047593aa3d526e78d805086');

  likesCollection.findOne({ _id: objectID }, (err, likesObject) => {
    if (err) {
      console.log(err);
    } else if (likesObject.likes) {
      profileCollection
        .find({ _id: { $nin: likesObject.likes } })
        .toArray((err, users) => {
          if (err) {
            console.log(err);
          } else {
            res.render('recommendations', {
              title: 'Een lijst met accounts',
              users,
            });
          }
        });
    } else {
      profileCollection.find({}).toArray((err, users) => {
        if (err) {
          console.log(err);
        } else {
          res.render('recommendations', {
            title: 'Een lijst met accounts',
            users,
          });
        }
      });
    }
  });
});

app.get('/savedprofiles', async (req, res) => {
  const objectID = new ObjectID('6047593aa3d526e78d805086');

  likesCollection.findOne({ _id: objectID }, (err, likesObject) => {
    if (err) {
      console.log(err);
    } else if (likesObject.likes) {
      profileCollection
        .find({ _id: { $in: likesObject.likes } })
        .toArray((err, users) => {
          if (err) {
            console.log(err);
          } else {
            res.render('userprofile', {
              title: 'opgeslagen accounts',
              users,
            });
          }
        });
    } else {
      res.render('userprofile', {
        title: 'opgeslagen accounts',
      });
    }
  });
});

app.get('/chat', (req, res) => {
  res.render('chat', {
    title: 'chats',
  });
});

app.post('/likeuser', async (req, res) => {
  const objectID = new ObjectID('6047593aa3d526e78d805086');
  const likedUser = new ObjectID(req.body.userid);

  await likesCollection.update(
    { _id: objectID },
    { $push: { likes: likedUser } },
  );

  likesCollection.findOne({ _id: objectID }, (err, likesObject) => {
    if (err) {
      console.log(err);
    } else {
      profileCollection
        .find({ _id: { $in: likesObject.likes } })
        .toArray((err, users) => {
          if (err) {
            console.log(err);
          } else {
            res.render('userprofile', {
              title: 'opgeslagen accounts',
              users,
            });
          }
        });

      profileCollection
        .find({ _id: { $nin: likesObject.likes } })
        .toArray((err, users) => {
          if (err) {
            console.log(err);
          } else {
            console.log(users);
          }
        });
    }
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
