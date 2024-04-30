const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 3000;
require("dotenv").config();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://toy-market-84c26.web.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "authorization"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Toy Market Server!");
});

const { MongoClient, ServerApiVersion, Db, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASWORD}@cluster0.1ranzbu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = "mongodb://localhost:27017";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// const client = new MongoClient(uri);

async function run() {
  try {
    const toymarket = client.db("toymarket");
    const allToys = toymarket.collection("allToys");

    app.post("/allToys", async (req, res) => {
      const newToy = req.body;
      const result = await allToys.insertOne(newToy);
      res.json(result);
    });
    app.get("/allToysData", async (req, res) => {
      const cursor = allToys.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/CertainToyData/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = allToys.find({ _id: new ObjectId(id) });
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/getDataByCategory", async (req, res) => {
      const Category = req.query.category;
      const cursor = allToys.find({ ToyCategory: Category });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/UsersToysData", async (req, res) => {
      const data = req.query.Contact;
      // console.log(data);
      const cursor = allToys.find({ SellerContact: data });
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/AllToysData", async (req, res) => {
      const id = req.query.id;
      const result = await allToys.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });
    app.patch("/UpdatesToyData/:id", async (req, res) => {
      const ID = req.params.id;
      const updatedData = await req.body;
      const result = allToys.updateOne(
        { _id: new ObjectId(ID) },
        { $set: updatedData }
      );
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.log);

app.listen(3000, () => console.log(`Server running on port ${port}`));
