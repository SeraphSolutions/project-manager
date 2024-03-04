const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();



var pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise();

//#region Post user functions

async function createUser(username, password){
  const [result] = await pool.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, password]);
  return result;
}



//#endregion

//#region Get user functions

async function getUsers(){
  const [result] = await pool.query('SELECT * FROM user');
  return result;
}

async function getUserById(id){
  const [result] = await pool.query('SELECT * FROM user WHERE userId='+id);
  return result;
}

async function getUserId(username){
  const [result] = await pool.query('SELECT * FROM user WHERE username='+username);
  return result;
}

//#endregion

//#region Get tasks functions

async function getTaskByUserId(id){
  const [taskIds] = await pool.query('SELECT taskId FROM assignedTasks WHERE userId='+id);
  const taskIdsArray = taskIds.map((current)=>{ return current.taskId; });
  const [task] = await pool.query('SELECT * FROM task WHERE taskId IN ('+ pool.escape(taskIdsArray)+')');
  return task;
}

//#endregion

module.exports = {
  getUsers, getUserById, getUserId,
  getTaskByUserId, createUser}