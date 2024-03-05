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



//#endregion

//#region Get user functions

async function getUsers() {
  const [result] = await pool.query('SELECT * FROM User');
  return result;
}

async function getUserById(id) {
  const [result] = await pool.query('SELECT * FROM User WHERE userId=' + id);
  return result;
}

async function getUserId(username) {
  const [result] = await pool.query('SELECT * FROM User WHERE username=' + username);
  return result;
}

//#endregion

//#region Get tasks functions

async function getTaskByUserId(id) {
  const [taskIds] = await pool.query('SELECT taskId FROM assignedTasks WHERE userId=' + id);
  const taskIdsArray = taskIds.map((current) => { return current.taskId; });
  const [task] = await pool.query('SELECT * FROM task WHERE taskId IN (' + pool.escape(taskIdsArray) + ')');
  return task;
}

//#endregion

module.exports = {
  getUsers, getUserById, getUserId,
  getTaskByUserId, newUser,
}