require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json()) 




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xdpsuxi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)

async function run() {
    try {
        const postsCollection = client.db('simpleMedia').collection('posts')

        app.get('/posts', async (req, res) => {
            const query = {}
            const result = await postsCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query)
            const result = await postsCollection.find(query).toArray();
            res.send(result);

        })
        
        app.post('/posts', async (req, res) => {
            const item = req.body
            console.log(item)
            const result = await postsCollection.insertOne(item)
            res.send(result)
        })

        app.put('/posts/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            const option = {upsert: true};
            const updatedUser = {
                $set: {
                  react : user.react
                }
            }
            const result = await postsCollection.updateOne(filter, updatedUser, option);
            res.send(result);
         })
    }
    finally {

    }
}
run().catch(err => console.error(err))
app.get('/', (req, res) => {
    res.send('post is running on ')
})

app.listen(port, () => {
    console.log(`my post is running on ${port}`)
})