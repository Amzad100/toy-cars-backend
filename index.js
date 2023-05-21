const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.73bu6ml.mongodb.net/?retryWrites=true&w=majority`;

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

        const toysCollection = client.db('toycars').collection('toys');


        const indexkey = { toy_name: 1, category_name: 1 };
        const indexoption = { name: "toy_namecategory_name" };

        const result = await toysCollection.createIndex(indexkey, indexoption)


        app.post('/addtoy', async (req, res) => {
            const body = req.body;
            const result = await toysCollection.insertOne(body)
            console.log(result);
            res.send(result)
        })

        app.get('/alltoys', async (req, res) => {
            const result = await toysCollection.find({}).toArray();
            res.send(result);
        })
        
        app.get('/alltoys/:category', async (req, res) => {
            console.log(req.params.category)
            if (req.params.category == "SportsCars" || req.params.category == "PoliceCars" || req.params.category == "Truck") {
                const result = await toysCollection.find({ category_name: req.params.category }).toArray();
                return res.send(result)
            }
            const result = await toysCollection.find({}).toArray();
            res.send(result);
        })



        


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
    res.send('toy cars is running')
})

app.listen(port, () => {
    console.log(`toy cars server is running in part: ${port}`);
})
