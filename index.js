const express = require('express');
const cors = require("cors");
const app = express();
const port = 3000
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://jobs-db:KY2pkYjUsLig9EXN@nitech.towh5i4.mongodb.net/?appName=nitech";

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
    
    // await client.connect();

    const db = client.db("jobs-db")
    const allJobsCollection = db.collection("all-jobs")

// To show all-jobs 
    app.get('/all-jobs',async(req,res)=>{
        const result = await allJobsCollection.find().toArray();
        res.send(result);

    })

    // Prticular data find er jonno 

    app.get('/all-jobs/:id',async(req,res)=>{
        const {id} = req.params
        
        const result = await allJobsCollection.findOne({_id: new ObjectId(id)})
        res.send({
            sucess : true,
            result
        })
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello I am From Server Site &&&....')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
