const express = require('express');
const cors = require('cors');
const app = express();

const collection = require('./database/index');
app.use(cors({
  origin: 'https://navigatorsyouth.netlify.app', 'http://localhost:3000',
}));

const PORT = 3001;
app.listen(PORT, (req, res)=>{
  console.log("Listening on port 3001");
})

app.get('/feed', async (req,res)=>{
  try {
    const feed = await collection.find().toArray();
    console.log(feed); // Log the result
    res.send(feed);
  } catch (error) {
    console.error(error); // Log any errors
    res.status(500).send('Internal Server Error');
  }
});
