use("project_manager");

const usrnm = "SantiTest";

// Run a find command to view user
const user = db.getCollection('User').find({username: usrnm});

console.log(user)
  
