
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://jobs-db:KY2pkYjUsLig9EXN@nitech.towh5i4.mongodb.net/?appName=nitech";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const db = client.db("jobs-db");
        const allJobsCollection = db.collection("all-jobs");
        const acceptedjobCollection = db.collection("accepted");
        const addJobsCollection = db.collection("addjobs");

        //  Get all jobs
        app.get('/all-jobs', async (req, res) => {
            const result = await allJobsCollection.find().toArray();
            res.send(result);
        });

        // Get single job
        app.get('/all-jobs/:id', async (req, res) => {
            const { id } = req.params;
            const result = await allJobsCollection.findOne({ _id: new ObjectId(id) });
            res.send({ success: true, result });
        });


        //post a job in addjobs collection 
        app.post('/addjobs',async(req,res)=>{
            const data = req.body;
            const result = await addJobsCollection.insertOne(data);
            res.send({
                success:true,
                result
            })
        })

        // get posted data from addjobs collection

        app.get('/addjobs',async(req,res)=>{
            const result = await addJobsCollection.find().toArray();
            res.send(result);
        })

        // all jobs
        app.get('/addjobs', async (req, res) => {
            const result = await addJobsCollection.find().toArray();
            res.send(result);
        });

        // get single job
        app.get('/addjobs/:id', async (req, res) => {
            const id = req.params.id;
            const result = await addJobsCollection.findOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // update job
        app.put('/addjobs/:id', async (req, res) => {
            const id = req.params.id;
            const updatedJob = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = { $set: updatedJob };
            const result = await addJobsCollection.updateOne(filter, updateDoc);
            res.send(result);
        });


        // Delete addjobs data  
        app.delete('/addjobs/:id', async (req, res) => {
            const { id } = req.params;

            try {
                const result = await addJobsCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 1) {
                    res.send({ success: true, message: 'Job deleted successfully' });
                } else {
                    res.status(404).send({ success: false, message: 'Job not found' });
                }
            } catch (err) {
                res.status(500).send({ success: false, message: err.message });
            }
        });



        // Insert accepted job (Fixed with ObjectId)
        app.post('/accepted', async (req, res) => {
            try {
                const data = req.body;
                const jobId = new ObjectId(data._id);

                const existing = await acceptedjobCollection.findOne({ _id: jobId });
                if (existing) {
                    return res.status(409).send({
                        success: false,
                        message: 'This job is already accepted!'
                    });
                }

                const result = await acceptedjobCollection.insertOne({
                    ...data,
                    _id: jobId
                });

                res.send({
                    success: true,
                    message: 'Job accepted successfully!',
                    result
                });
            } catch (error) {
                console.error('Error inserting job:', error);
                res.status(500).send({
                    success: false,
                    message: 'Internal server error'
                });
            }
        });

        // Delete accepted job (Fixed response)
        app.delete('/accepted/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const result = await acceptedjobCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 1) {
                    res.send({
                        success: true,
                        message: "Deleted successfully!"
                    });
                } else {
                    res.status(404).send({
                        success: false,
                        message: "Job not found!"
                    });
                }
            } catch (err) {
                console.error("❌ Error deleting:", err);
                res.status(500).send({
                    success: false,
                    message: "Delete failed!"
                });
            }
        });

        //  Get all accepted jobs
        app.get('/accepted', async (req, res) => {
            const result = await acceptedjobCollection.find().toArray();
            res.send(result);
        });

        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB!");
    } finally {
        // keep server running
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running fine.');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

