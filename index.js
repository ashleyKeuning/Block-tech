// Imports > het haalt de gegevens, informatie op van de package
const express = require('express');
const bodyParser = require('body-parser');

/*
 * bodyparrser is voor de userinput
 *  imports van de database
 */

const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');
const multer = require('multer');

/*
 * opbject id is de id van de database
 *  tussen de curly brackets wordt het object
 */

const app = express();
const exphbs = require('express-handlebars');

const port = 3000;

// test voor database

console.log(process.env.TESTVAR);
// om de connectie met de database te testen

let db = null;
let likesCollection = null;
let profileCollection = null;
// nul is een lege string of een niet bestaande waarde

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

/*
 * async werkt samen met await, de database moet eerst geladen
 * worden voordat het de volgende code uitvoert
 */
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

// Homepagina
app.get('', (req, res) => {
  res.render('home');
});

// Recommendations pagina (de feature) // het halen/krijgen van informatie
app.get('/recommendations', async (req, res) => {
  // de functie voor de like option
  const objectID = new ObjectID('6047593aa3d526e78d805086');

  /*
   *  dit is de object van de id in de mongo db, dit wordt gezet in een array
   * wanneer je meerder profielen toevoegd
   */
  likesCollection.findOne({ _id: objectID }, (err, likesObject) => {
    /*
     * dit
     * likes collection is een collection in de database, het zoek de id van de object id in de regel hierboven
     */
    if (err) {
      console.log(err); // als er een error dan showt het een error
    } else if (likesObject.likes) {

      /*
       * wanneer de gebruiker een profiel geliked
       *  wordt dan wordt die zelfde profiel van de pagina verwijdert
       */
      profileCollection // in de profile collection wordt die profiel verwijdert
        .find({ _id: { $nin: likesObject.likes } }) // nin = not in array //find id uit de database
        .toArray((err, users) => {
          // add de gelikede profielen worden in een array geplaatst en in de collectie van likes.
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
      // anders wordt het aan een array toegevoed
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
// dit is de pagina voor saved profiles
app.get('/savedprofiles', async (req, res) => {
  const objectID = new ObjectID('6047593aa3d526e78d805086');
  // object van de eerste id
  likesCollection.findOne({ _id: objectID }, (err, likesObject) => {
    if (err) {
      console.log(err);
    } else if (likesObject.likes) {
      profileCollection
        .find({ _id: { $in: likesObject.likes } }) // wanneer er een profiel wordt geliked
        // wordt deze in de saved profiles pagina bewaard
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

// het submitten van de button
app.post('/likeuser', async (req, res) => {
  const objectID = new ObjectID('6047593aa3d526e78d805086');
  const likedUser = new ObjectID(req.body.userid); // is de button van de like button

  await likesCollection.update(

    /*
     * het update de database, door de push, door het te pushen wordt er er een
     *  object in de array gezet in de likes profile
     */
    { _id: objectID },
    { $addToSet: { likes: likedUser } }, // push is om meer objecten in de array.
  );

  likesCollection.findOne({ _id: objectID }, (err, likesObject) => {
    if (err) {
      console.log(err);
    } else {
      profileCollection
        .find({ _id: { $in: likesObject.likes } }) // de collectie likes komen in de pagina van de savedprofiles
        .toArray((err, users) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/recommendations');
          }
        });

      /*
       * als het in de savedprofile pagina staat, of in de likes collectie
       * wordt het verwijdert ui te de recommendation pagina
       */
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
app.post('/savedprofiles', async (req, res) => {
  const objectID = new ObjectID('6047593aa3d526e78d805086');
  const likedUser = new ObjectID(req.body.userid2); // is de button van de like button

  await likesCollection.update(
    { _id: objectID },
    {
      $pull: { likes: likedUser },
    },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        // console.log(objectID, likesObject.likes);
      }
    },
  );
  await likesCollection
    .findOne({ _id: objectID })
    .then((user) => {
      // Fill session with user data
    })
    .catch((err) => console.log(err));
  res.redirect('/savedprofiles');
});

// Error pagina
app.use((req, res, next) => {
  res.status(404).send('This page does not exsist! ... sorry!');
});

// Listen
app.listen(3000, () => {
  console.log('Express web app on localhost:3000');
});

// const is een arrow function
