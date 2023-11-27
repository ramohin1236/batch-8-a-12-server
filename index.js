const express = require('express');
const app= express();
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_KEY)
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


// console.log(DB_USER,DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vjcdyry.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const userCollection = client.db('asset-management').collection('users')
    const hrAssetCollection = client.db('asset-management').collection('hrasset')

// user create
    app.post('/users', async (req,res)=>{
        const user = req.body;
        // const query ={email: email}
        // const existingUser = await userCollection.findOne(query)
        // if(existingUser){
        //     return res.send({message: 'User already exists', insertedId: null})
        // }
        const result = await userCollection.insertOne(user)
        res.send(result)
    })

    // added product by admin
    // TODO: jwt empliment
    app.post('/addProduct', async(req,res)=>{
        const product = req.body;
        const result = await hrAssetCollection.insertOne(product)
        res.send(result)
    })
    app.get('/addProduct', async(req,res)=>{
        const email = req.query.email;
        const query = {email: email}
        const result = await hrAssetCollection.find(query).toArray()
        res.send(result)
    })
    app.delete("/addProduct/:id", async(req,res)=>{
        const id =req.params.id;
        const query= {_id: new ObjectId(id)}
        const result = await hrAssetCollection.deleteOne(query)
        res.send(result)
     })

// payments by stripe
// app.post('/create-payment-intent', async(req,res)=>{
//     const {package}= req.body;
//     console.log(package)
//     const price = parseFloat(package)

//     const paymentIntent = await stripe.paymentIntents.create({
//        amount: price,
//        currency: 'usd',
//        payment_method_types: [
//            "card"
//          ],
//     })

//     res.send({
//         clientSecret: paymentIntent.client_secret
//     })
// })

































    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
















app.get('/', (req,res)=>{
    res.send('server is runnig')
})


app.listen(port, ()=>{
    console.log(`final assignment is running on port ${port}`)
})