require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json()) 

// test


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xdpsuxi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)

async function run() {
    try {
        const postsCollection = client.db('simpleMedia').collection('posts')
        const aboutCollection = client.db('simpleMedia').collection('about')
        const commentsCollection = client.db('simpleMedia').collection('comments')

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
            // console.log(item)
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


         app.put('/about/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
            console.log(user)
            const option = {upsert: true};
            const updatedUser = {
                $set: {
                  university: user.university,
                  address: user.address,
                  phone: user.phone
                }
            }
            const result = await aboutCollection.updateOne(filter, updatedUser, option);
            res.send(result);
         })

         app.get('/about/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query)
            const result = await aboutCollection.find(query).toArray();
            res.send(result);

        })
        app.get('/about', async(req , res) =>{
            let query = {};
            if(req.query.email){
                query ={
                    email : req.query.email
                }
            }
            const cursor = aboutCollection.find(query);
            const abouts = await cursor.toArray();
            res.send(abouts)
        })
         app.post('/about', async (req, res) => {
            const info = req.body
            console.log(info)
            const result = await aboutCollection.insertOne(info)
            res.send(result)
        })

         app.post('/comments', async (req, res) => {
            const item = req.body
            // console.log(item)
            const result = await commentsCollection.insertOne(item)
            res.send(result)
        })

        app.get('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { categoryId: id };
            console.log(query)
            const result = await commentsCollection.find(query).toArray();
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