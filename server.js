const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require("dotenv").config()

const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// user:todoApp
// pass:GTGIpsURBjZyflcS
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0ib4x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log("db connected");

  const collection = client.db("test").collection("devices");
  async function run() {
    try {
      await client.connect();
      const taskCollection = client.db("todoApp").collection("task");
  
      // read all task
      app.get("/tasks", async (req, res) => {
        const query = {};
        const cursor = taskCollection.find(query);
        const tasks = await cursor.toArray();
        res.send(tasks);
      });
  
      // read task by single id
      app.get("/tasks/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await taskCollection.findOne(query);
        res.send(result);
      });
  
      // get add task data by post
      app.post("/add-task", async (req, res) => {
        const newTask = req.body;
        const result = await taskCollection.insertOne(newTask);
        res.send(result);
      });
  
      // delete task
      app.delete("/tasks/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await taskCollection.deleteOne(query);
        res.send(result);
      });
    } finally {
    }
  }
  
  run().catch(console.dir);
});

// read all data
app.get("/", (req, res) => {
    res.send("HELLO WORLD!");
  });
  
  // port
  app.listen(port, () => {
    console.log(`server is running on ${port}`);
  });