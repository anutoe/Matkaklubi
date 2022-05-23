const express = require('express');
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const PORT = process.env.PORT || 5000;

let matkad;


const uri = "mongodb+srv://anutoe:AqpRP5yt@cluster0.hbaer.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("matka-app-2203").collection("treks").find().toArray((err, result) => {
  // perform actions on the collection object
  console.log(collection)
  client.close();
  })});


  const loeMatkadMallu = (async () => {
    try {
      await client.connect();
      const collection = client.db('matka-app-2203').collection('treks');
      matkad = await collection.find().toArray();
    } finally {
      await client.close();
      console.log(matkad);
    }
  })()
  
  const naitaMatkaVaadet = async (req, res) => {
    let matk;
    try {
      await client.connect();
      const collection = client.db('matka-app-2203').collection('treks');
      matk = await collection.findOne({ _id: new ObjectId(req.params.matkaId) });
    } catch (error) {
      console.log(error);
    } finally {
      await client.close();
    }
    return res.render('pages/trek', { matk });
  }
  
  const registreeriOsaleja = async (req, res) => {
    const paringuKeha = req.body;
    try {
      await client.connect();
      const collection = client.db('matka-app-2203').collection('treks');
      const filter = { _id: new ObjectId(paringuKeha.matkaId) };
      const updateDoc = {
        $push: { participants: paringuKeha.osaleja }
      };
      matk = await collection.updateOne(filter, updateDoc);
      res.json({ response: 'Töötas!' });
    } catch (error) {
      console.log(error);
      res.json({ response: 'Katki läks!' });
    } finally {
      await client.close();
    }
  }
  
  const tagastaMatkad = async (req, res) => {
    try {
      await client.connect();
      const collection = client.db('matka-app-2203').collection('treks');
      const treks = await collection.find().toArray();
      res.json(treks);
    } catch (error) {
      console.log(error);
      res.json({ response: 'Katki läks!' });
    } finally {
      await client.close();
    }
  }
  
  const salvestaMatk = async (req, res) => {
    const matkaId = req.params.matkaId;
    try {
      await client.connect();
      const collection = client.db('matka-app-2203').collection('treks');
      const filter = { _id: new ObjectId(matkaId) };
      const updateDoc = {
        $set: {
          title: req.body.title,
          description: req.body.description,
          imageUrl: req.body.imageUrl,
        }
      };
      matk = await collection.updateOne(filter, updateDoc);
      res.json({ response: 'Töötas!' });
    } catch (error) {
      console.log(error);
      res.json({ response: 'Katki läks!' });
    } finally {
      await client.close();
    }
  }

 
 
const uudis1 = {
  id: 0,
  title:'Toimus kepikõnd ümber Ülemiste järve',
  date: '6. juuni',
  author: 'Mari Murakas',
  description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  imageUrl: 'https://shawellnessclinic.com/wp-content/uploads/2014/11/nordic-walking3.jpg',
};
const uudis2 = {
  id: 1,
  title:'Toimus rattamatk ümber Naissaare',
  date: '2. juuli',
  author: 'Mari Murakas',
  description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  imageUrl: 'https://trek.scene7.com/is/image/TrekBicycleProducts/b300_mtbMarqueeImage?wid=1200',
};
const uudis3 = {
  id: 2,
  title:'Toimus ujumine üle Suure Väina',
  date: '29. mai',
  author: 'Mari Murakas',
  description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  imageUrl: 'http://ontheedgemag.com/wp-content/uploads/2018/08/Ice-Swim-3-Ryan-Stramrood.jpg',
};
 
const uudised = [uudis1, uudis2, uudis3];
 
 
const naitaUudiseid = (req, res) => {
  const uudis = uudised.find((uudis) => uudis.id === parseInt(req.params.uudiseId));
  return  res.render('pages/uudis', { uudised: uudis });
 
};

express()
  .use(express.json())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/contact', (req, res) => res.render('pages/contact'))
  .get('/trek/:matkaId', naitaMatkaVaadet)
  .get('/treks', (req, res) => res.render('pages/treks', { matkad: matkad }))
  .get('/uudis/:uudiseId', naitaUudiseid )
  .get('/news', (req, res) => res.render('pages/news', { uudised: uudised }))
  .post('/api/register', registreeriOsaleja)
  .get('/api/treks', tagastaMatkad)
  .post('/api/treks/:matkaId', salvestaMatk)
  .get('/admin', (req, res) => res.render('pages/admin'))
  .listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
