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
            try {
                const { searchText, brand, category, priceRange, sortBy, page, size } = req.query;
                console.log(page, size);
                // Build query object based on parameters
                const query = {};
                if (searchText) query.productName = searchText;
                if (brand) query.brand = brand;
                if (category) query.category = category;;
                if (priceRange) query.price = { $lte: parseFloat(priceRange) };

                // Fetch products with query object
                let result = AllProductsCollections.find(query).skip(parseInt(page) * parseInt(size)).limit(parseInt(size));

                if (sortBy) {
                    // Example sorting by price: { price: 1 } for ascending, { price: -1 } for descending
                    result = result.sort({ price: sortBy === 'lowToHigh' ? 1 : -1 });
                }

                result = await result.toArray();
                res.send(result);
            } catch (error) {
                console.error('Error fetching products:', error);
                res.status(500).send('Internal Server Error');
            }
        });
        app.get('/countOfProduct', async (req, res) => {
                const count = await AllProductsCollections.estimatedDocumentCount() ;
                res.send({count })
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