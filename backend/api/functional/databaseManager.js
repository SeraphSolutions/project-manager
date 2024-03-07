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
async function userIsAdmin(user){
  if (typeof user === 'string' || user instanceof String){
    userData = await selectUserByName(user);
    user = userData[0]['userId']
  }
  const [result] = await pool.query('SELECT isAdmin FROM User WHERE userId=?',[user]);
  return result[0].isAdmin;
}
//#endregion

//#region User related functions

//#region insert user functions

async function insertUser(username, password) {
  console.log("Creating user with username:", username, "and password:", password);
  try {
    const [result] = await pool.query('INSERT INTO User (username, password) VALUES (?, ?)', [username, password]);
    return result;
  } catch (error) {
    console.error("SQL Error creating user: ", error.message);
    throw error;
  }
}

//#endregion

//#region Select user functions

async function selectUsers() {
  const [result] = await pool.query('SELECT * FROM User');
  return result;
}

async function selectUserById(id) {
  const [result] = await pool.query('SELECT * FROM User WHERE userId=?',[id]);
  return result;
}

async function selectUserByName(username) {
  const [result] = await pool.query('SELECT * FROM User WHERE username=?',[username]);
  return result;
}

async function selectUserByTask(taskId){
  const [result] = await pool.query('SELECT userId FROM AssignedTasks WHERE taskId=?',[taskId]);
  return result;
}

//#endregion

//#region Update user functions

async function updateUsername(userId, newUsername){
  const [result] = await pool.query('UPDATE User SET username=? WHERE userId=?',[newUsername, userId]);
  return result;
}

async function updatePassword(userId, newPassword){
  const [result] = await pool.query('UPDATE User SET password=? WHERE userId=?',[newPassword, userId]);
  return result;
}

//#endregion

//#region Delete user functions

async function deleteUser(userId){
  const [result] = await pool.query('DELETE FROM User WHERE userId=?',[userId]);
  return result;
}

//#endregion

//#endregion

//#region Task related functions

//#region select tasks functions

async function selectTaskByUserId(userId) {
  const [taskIds] = await pool.query('SELECT taskId FROM AssignedTasks WHERE userId=?',[userId]);
  const taskIdsArray = taskIds.map((current) => { return current.taskId; });
  const [tasks] = await pool.query('SELECT * FROM Task WHERE taskId IN (' + pool.escape(taskIdsArray) + ')');
  return tasks;
}

async function selectTaskById(taskId) {
  const [task] = await pool.query('SELECT * FROM Task WHERE taskId=?',[taskId]);
  return task;
}

async function selectSubtasks(taskId, taskStack=[]){
  //Level order traversal of task tree using a recursive function.
  const [directSubtasks] = await pool.query('SELECT taskId FROM Task WHERE parentTask=?', [taskId]);
  if(directSubtasks.length > 0){
    taskStack.push(directSubtasks);
    for (const task of directSubtasks) {
      await selectSubtasks(task.taskId, taskStack);
    }
    await directSubtasks.forEach(task => selectSubtasks(task.taskId, taskStack));
  }
  return taskStack;
}

async function getRootTask(taskId){
  var task = await selectTaskById(taskId);
  while(task[0]['parentTask']){
    task = await selectTaskById(task[0]['parentTask']);
  }
  return task[0];
}

//#endregion

//#region insert tasks functions
async function insertTask(userId, name, description = null, parentTask = null, priority = 1, state = 'Pending', deadline = null){
  const [result] = await pool.query('INSERT INTO Task (name, description, parentTask) VALUES (?, ?, ?)', [name, description, parentTask]);
  const taskId = result.insertId;
  if(!parentTask){
    await pool.query('INSERT INTO AssignedTasks (userId, taskId) VALUES (?, ?)', [userId, taskId]);
  }
  await pool.query('INSERT INTO Status (taskId, priority, state, deadline) VALUES (?, ?, ?, ?)', [taskId, priority, state, deadline]);
}
//#endregion

//#region Update tasks functions

//#endregion

//#region Delete tasks functions

async function deleteTaskById(taskId){
  const [result1] = await pool.query('DELETE FROM AssignedTasks WHERE taskId=?',[taskId]);
  const [result2] = await pool.query('DELETE FROM Status WHERE taskId=?',[taskId]);
  const [result3] = await pool.query('DELETE FROM Task WHERE taskId=?',[taskId]);
  return [result1, result2, result3];
}

async function wipeTree(taskId){
  var subtasks = await selectSubtasks(taskId);
  subtasks = subtasks.reverse();
  for(const level of subtasks){
    for(const task of level){
      await deleteTaskById(task.taskId);
    }
  }
  await deleteTaskById(taskId);
}

//#endregion


//#endregion

module.exports = {
  selectUsers, selectUserById, selectUserByName, updateUsername, updatePassword, deleteUser, userIsAdmin,
  selectTaskByUserId, insertTask, insertUser, selectSubtasks, selectTaskById, getRootTask, selectUserByTask, wipeTree, deleteTaskById
}