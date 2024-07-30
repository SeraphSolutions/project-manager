const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://santiagopapa:s3rwpw8r9@seraph.9kcw72x.mongodb.net/?retryWrites=true&w=majority&appName=seraph";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect() {
  try {
    await client.connect();
    await client.db("project_manager").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } catch(err) {
    await client.close();
  }
}

async function addUser(username){
    collection = await client.db("project_manager").collection("User");
    await collection.insertOne({
      username: username   
    })
}

async function getUser(username){
  collection = await client.db("project_manager").collection("User");
  result = await collection.findOne({
    username: username   
  })
  return result;
}

async function testRun(){
  await connect();
  user = await getUser("Santiago");
  console.log(user);
}

testRun();