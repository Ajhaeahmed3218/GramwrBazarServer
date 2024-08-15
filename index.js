const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;


// Middleware gramerBazar        wvTYywznLsfTqhc4
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.itn5riw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Collections------------------>>>>START
        const AllProductsCollections = client.db("GrorerBazar").collection('AllProductDB')

        // Collections------------------>>>>end

        // Apis------------------------>>>START
        // Country data Api
        app.get('/allProduct', async (req, res) => {
            const result = await AllProductsCollections.find().toArray()
            res.send(result)
          })
        // Apis------------------------>>>END



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Gorer Bazar ')
})

app.listen(port, () => {
    console.log(`Gorer Bazar is running on ${port}`)
})