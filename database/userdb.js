const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://joshuadaqdev:Scribbles24.@joshuadaqdev.93lrrzq.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

client.connect()
  .then(()=>{
    console.log('Connected to the database.');
  })
  .catch((err)=>{
    console.log(err)
  });

const database = client.db("navigatorsyouthwebdb");
const collection = database.collection("user");

module.exports = collection;