const express = require('express');
const session = require('express-session');
const cors = require('cors'); //for cors policy
const MongoStore = require("connect-mongo"); //for database session
const app = express();
const userdb = require("./database/userdb");

require("./strategy/local");

const collection = require('./database/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "samplekey",
  saveUninitialized: false,
  resave: false,
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://joshuadaqdev:Scribbles24.@joshuadaqdev.93lrrzq.mongodb.net/?retryWrites=true&w=majority",
  })
}));


const passport = require('passport');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const PORT = 3001;
app.listen(PORT, (req, res)=>{
  console.log("Listening on port 3001");
})

app.use(passport.initialize());




app.post('/createAccount', async (req, res)=>{
  const { fName, lName, uName, password } = req.body;

  const createAcc = await userdb.insertOne({
    fName: fName,
    lName: lName,
    username: uName,
    password: password,

  })

  if(createAcc){
    console.log("User account created successfully");
    res.sendStatus(200);
  }else{
    console.log("User account creation failed");
  }
})
app.post('/login', passport.authenticate('local'),(req, res) => {
  console.log("Logged In");
  res.sendStatus(200);
});
app.use(passport.session());
app.use((req, res, next)=>{
  if(req.user){
    console.log(req.user);
    next();
  }else{
    res.sendStatus(401);
  }
});

app.get('/', async (req, res)=>{
  res.send(req.user.username);
})


app.get('/feed', async (req,res)=>{
  try {
    const feed = await collection.find().toArray();
    console.log(req.user.username);
    res.send(feed);
  } catch (error) {
    console.error(error); // Log any errors
    res.status(500).send('Internal Server Error');
  }
});

app.post('/addFeed', async (req, res)=>{
  const username = req.user.username;
  const {content} = req.body;
  const addFeed = await collection.insertOne({
    content: content,
    username: username,
  })
  console.log("Feed added!");
  res.sendStatus(200);
})

app.post('/logout', (req, res) => {
  // Destroy session in memory
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.sendStatus(500); // Internal Server Error
    }
    console.log('Session destroyed successfully');
    res.sendStatus(200);
  });
});
