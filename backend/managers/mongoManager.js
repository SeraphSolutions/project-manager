const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/../.env'})
const uri = process.env.MONGO_URI;

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

//#region Utility Functions
async function hasAccessToTask(userId, taskId){
  collection = await client.db("project_manager").collection("User");
  const user = await collection.findOne({
    _id: new ObjectId(userId)
  })
  for(task of user.assignedTasks){
    if(task.toString() == taskId){
      return true;
    }
  }
  return false;
}

async function isTaskOwner(userId, taskId){
  collection = await client.db("project_manager").collection("Task");
  const task = await collection.findOne({
    _id: new ObjectId(taskId)
  })
  if(task.creator.toString() == userId){
    return true;
  }
  return false;
}

//#endregion

//#region User Functions

async function addUser(username, hashedPassword){
    collection = await client.db("project_manager").collection("User");
    return await collection.insertOne({
      username: username,   
      hashedPassword: hashedPassword,
      isAdmin: false,
      assignedTasks: []
    })
}

async function getUser(username){
  collection = await client.db("project_manager").collection("User");
  result = await collection.findOne({
    username: username   
  })
  return result;
}

async function getAllUsers(){
  collection = await client.db("project_manager").collection("User");
  result = await collection.find({})
  const documents = await result.toArray();
  return documents;
}

async function assignToTask(userId, taskId){
  collection = await client.db("project_manager").collection("User");
  const result = await collection.updateOne(
    { _id: new ObjectId(userId)},
    { $push: { assignedTasks: new ObjectId(taskId) } }
  );
}

async function unassignToTask(userId, taskId){
  collection = await client.db("project_manager").collection("User");
  const result = await collection.updateOne(
    { _id: new ObjectId(userId)},
    { $pull: { assignedTasks: new ObjectId(taskId) } }
  );
}

async function makeUserAdmin(userId) {
    const result = await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: { isAdmin: true }
      });
}

async function deleteUser(userId) {
  collection = await client.db("project_manager").collection("User");
  const result = await collection.deleteOne(
    { _id: userId }
  );
}

//#endregion

//#region Task Functions

async function getTask(taskId){
  collection = await client.db("project_manager").collection("Task");
  result = await collection.findOne({
    _id: new ObjectId(taskId)   
  })
  return result;
}

async function addTask(userId, title, description, deadline){
  collection = await client.db("project_manager").collection("Task");
  const taskId = await collection.insertOne({
      creator: new ObjectId(userId),
      title: title,
      description: description,
      deadline: deadline
    })
    return taskId.insertedId.toString();
}

async function updateTask(taskId, field, value){
  collection = await client.db("project_manager").collection("Task");
  result = await collection.findOne({
    _id: new ObjectId(taskId)   
  })
  return result;
}

//#endregion

module.exports = {addUser, getUser, getAllUsers, addTask, getTask, assignToTask, unassignToTask, isTaskOwner, hasAccessToTask, makeUserAdmin, deleteUser}