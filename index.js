const express = require('express')
const app = express()
const cors =require('cors');
const bobyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bobyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bghwt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const newsCollection = client.db("newsHeadline").collection("newses");
  const adminCollection = client.db("newsHeadline").collection("admins");


  app.get('/newses',(req,res)=>{
    newsCollection.find()
      .toArray((err,items)=>{
          res.send(items)
        
      })

  })

  app.post('/addNews',(req,res)=>{

   const newEvent = req.body;
   newsCollection.insertOne(newEvent)
   .then(result=>{
       res.send(result.insertedCount > 0)
   })

  })

  app.post('/addAdmin',(req,res)=>{

    const newAdmin = req.body
    adminCollection.insertOne(newAdmin)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
 
   })
   app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admins) => {
        res.send(admins.length > 0);
      })
  })
 
});


app.listen(port, () => {
  console.log(port)
})