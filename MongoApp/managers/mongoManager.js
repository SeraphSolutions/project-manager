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
var database = undefined;
try{
  client.connect();
  database = client.db("project_manager"); 
}catch(err) {
  client.close();
}

//#REGION User Functions

async function addUser(username, hashedPassword){
    collection = await client.db("project_manager").collection("User");
    await collection.insertOne({
      username: username,   
      hashedPassword: hashedPassword
    })
}

async function getUser(username){
  collection = await client.db("project_manager").collection("User");
  result = await collection.findOne({
    username: username   
  })
  return result;
}

//#endregion

module.exports = {addUser, getUser}