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
    const bookingCollection = database.collection('booking');

    app.get('/', (req, res) => {
      res.send("I am from server side for mongo & crud");
      res.send("I am from server side for mongo only");
      console.log('hello from log');
    });

    //get destinations api
    app.get('/destinations', async (req, res) => {
      const cursor = placeCollection.find({});
      const places = await cursor.toArray();
      res.send(places);
    })

    //post new destinaitons api 
    app.post('/descriptions', async(req, res)=>{
      const newPlace = req.body;
      console.log(newPlace);
      const result = await placeCollection.insertOne(newPlace);
      res.json(result);
    })

    //get signle api
    app.get('/destinations/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const place = await placeCollection.findOne(query);
      console.log('loading user data with id', id);
      res.send(place);
    })
    // get photo api 
    app.get('/gallary', async (req, res) => {
      const cursor = photoCollection.find({});
      const photos = await cursor.toArray();
      res.send(photos);
    })
    // Post photo api
    app.post('/gallary', async (req, res) => {
      const photo = req.body;
      const result = await photoCollection.insertOne(photo);

      res.json(result);
    })

    //post booking info
    app.post('/booking', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.json(result);
    })

    //get booking info
    app.get('/booking', async (req, res) => {
      const cursor = bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.send(bookings);
    })
    //get single booking info
    app.get('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const booking = await bookingCollection.findOne(query);
      // console.log(booking);
      res.json(booking)
    })
    //update a booking info
    app.put('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const updatedBooking = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedBooking.name,
          email: updatedBooking.email,
          address: updatedBooking.address,
          address2: updatedBooking.address2,
          city: updatedBooking.city,
          state: updatedBooking.state,
          zip: updatedBooking.zip
        },
      }
      const result = await bookingCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })
    //delete booking info
    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    })



  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log('Listenning to port', port);
})