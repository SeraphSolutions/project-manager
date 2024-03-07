const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config({path:__dirname+'/../.env'});



var pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

//#region Utility Functions
//#endregion

//#region Post user functions

async function newUser(username, password) {
  console.log("Creating user with username:", username, "and password:", password);
  try {
    const [result] = await pool.query('INSERT INTO User (username, password) VALUES (?, ?)', [username, password]);
    return result;
  } catch (error) {
    console.error("SQL Error creating user: ", error.message);
    throw error;
  }
}

async function newTask(userId, taskName, taskDescription, parentTask = null){
  if(parentTask){
    //Don't add to assigned tasks, use parent task.
  }else{
    //New task tree, insert into assigned tasks with userId.
  }
}

//#endregion

//#region Get user functions

async function getUsers() {
  const [result] = await pool.query('SELECT * FROM User');
  return result;
}

async function getUserById(id) {
  const [result] = await pool.query('SELECT * FROM User WHERE userId=?',[id]);
  return result;
}

async function getUserByName(username) {
  const [result] = await pool.query('SELECT * FROM User WHERE username=?',[username]);
  return result;
}

async function userIsAdmin(user){
  if (typeof user === 'string' || user instanceof String){
    userData = await getUserByName(user);
    user = userData[0]['userId']
  }
  const [result] = await pool.query('SELECT isAdmin FROM User WHERE userId=?',[user]);
  return result[0].isAdmin;
}

//#endregion

//#region Get tasks functions

async function getTaskByUserId(userId) {
  const [taskIds] = await pool.query('SELECT taskId FROM assignedTasks WHERE userId=' + userId);
  const taskIdsArray = taskIds.map((current) => { return current.taskId; });
  const [task] = await pool.query('SELECT * FROM task WHERE taskId IN (' + pool.escape(taskIdsArray) + ')');
  return task;
}

async function getSubtasks(taskId, taskStack=[]){
  //Level order traversal of task tree using a recursive function.
  const [directSubtasks] = await pool.query('SELECT taskId FROM Task WHERE parentTask=' + taskId);
  if(directSubtasks.length > 0){
    taskStack.push(directSubtasks);
    for (const task of directSubtasks) {
      await getSubtasks(task.taskId, taskStack);
    }
    await directSubtasks.forEach(task => getSubtasks(task.taskId, taskStack));
  }
  return taskStack;
}

//#endregion

module.exports = {
  getUsers, getUserById, getUserByName,
  getTaskByUserId, newUser, getSubtasks
}