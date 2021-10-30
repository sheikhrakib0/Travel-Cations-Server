const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()


// using middleware
app.use(cors());
app.use(express.json());

//ceating client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a4uru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
  try {
    await client.connect();

    const database = client.db('travelCations');
    const placeCollection = database.collection('places');
    const photoCollection = database.collection("gallary");

    app.get('/', (req, res) => {
      res.send("I am from server side for mongo & crud");
      res.send("I am from server side for mongo only");
      console.log('hello from log');
    });

    //get destinations api
    app.get('/destinations', async(req, res)=>{
      const cursor = placeCollection.find({});
      const places = await cursor.toArray();
      res.send(places);
    })

    
    //get signle api
    app.get('/destinations/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const place = await placeCollection.findOne(query);
      console.log('loading user data with id', id);
      res.send(place);
    })
    // get photo api 
    app.get('/gallary', async(req, res)=>{
      const cursor = photoCollection.find({});
      const photos = await cursor.toArray();
      res.send(photos);
    })
    // Post photo api
    app.post('/gallary', async(req, res)=>{
      const photo = req.body;
      const result = await photoCollection.insertOne(photo);

      res.json(result);
    })
    


  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, ()=>{
  console.log('Listenning to port', port);
})