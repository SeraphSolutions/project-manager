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

async function isStrictlyAssigned(userId, taskId){
  const [result] = await pool.query('SELECT * FROM AssignedTasks WHERE userId=? AND taskId=?',[userId, taskId]);
  if(result[0]){
    return true;
  }else{
    return false;
  }
}

async function isAssigned(userId, taskId){
  var task = await selectTaskById(taskId);
    while(task[0]['parentTask']){
      if(isStrictlyAssigned(userId, task[0]['parentTask'])){return true}
      task = await selectTaskById(task[0]['parentTask']);
    }
    return false;
}
//#endregion

//#region User related functions

//#region Insert user functions

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

async function promoteToAdmin(userId){
  const [result] = await pool.query('UPDATE User SET isAdmin=? WHERE userId=?',[true, userId]);
  return result;
}

async function demoteToReg(userId){
  const [result] = await pool.query('UPDATE User SET isAdmin=? WHERE userId=?',[false, userId]);
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

//#region Select tasks functions

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

//#region Insert tasks functions
async function insertTask(userId, name, description = null, parentTask = null, priority = 1, state = 'Pending', deadline = null){
  const [result] = await pool.query('INSERT INTO Task (name, description, parentTask) VALUES (?, ?, ?)', [name, description, parentTask]);
  const taskId = result.insertId;
  if(!parentTask){
    await pool.query('INSERT INTO AssignedTasks (userId, taskId) VALUES (?, ?)', [userId, taskId]);
  }
  await pool.query('INSERT INTO Status (taskId, priority, state, deadline) VALUES (?, ?, ?, ?)', [taskId, priority, state, deadline]);
  return result;
}

async function assignUser(userId, taskId){
  const [result] = await pool.query('INSERT INTO AssignedTasks (userId, taskId) VALUES (?, ?)', [userId, taskId]);
  return result;
}

//#endregion

//#region Update tasks functions
async function updateTaskName(taskId, name){
  const [result] = await pool.query('UPDATE Task SET name=? WHERE taskId=?',[name, taskId]);
  return result;
}
async function updateTaskDescription(taskId, description){
  const [result] = await pool.query('UPDATE Task SET description=? WHERE taskId=?',[description, taskId]);
  return result;
}
async function updateTaskParent(taskId, parentTask){
  const [result] = await pool.query('UPDATE Task SET parentTask=? WHERE taskId=?',[parentTask, taskId]);
  return result;
}
async function updateTaskPriority(taskId, priority){
  const [result] = await pool.query('UPDATE Status SET priority=? WHERE taskId=?',[priority, taskId]);
  return result;
}
async function updateTaskState(taskId, state){
  const [result] = await pool.query('UPDATE Status SET state=? WHERE taskId=?',[state, taskId]);
  return result;
}
async function updateTaskDeadline(taskId, deadline){
  const [result] = await pool.query('UPDATE Status SET deadline=? WHERE taskId=?',[deadline, taskId]);
  return result;
}
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

async function unassignUser(userId, taskId){
  const [result] = await pool.query('DELETE FROM AssignedTasks WHERE taskId=? AND userId=?',[taskId, userId]);
  return result;
}

//#endregion


//#endregion

module.exports = {
  selectUsers, selectUserById, selectUserByName, updateUsername, updatePassword, deleteUser, userIsAdmin, isAssigned,

  selectTaskByUserId, insertTask, insertUser, selectSubtasks, selectTaskById, getRootTask, selectUserByTask, wipeTree, deleteTaskById,
  assignUser, unassignUser, updateTaskName, updateTaskDescription, updateTaskParent, updateTaskPriority, updateTaskState, updateTaskDeadline


}
