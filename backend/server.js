const app = require('./App'); 
const database = require('./managers/mongoManager');
const PORT = 8080;

app.listen(PORT, async () => {
  try {
      await database.connectToDatabase();
      console.log(`Server is running on port ${port}`);
  } catch (error) {
      console.error('Failed to connect to the database', error);
      process.exit(1);
  }
})