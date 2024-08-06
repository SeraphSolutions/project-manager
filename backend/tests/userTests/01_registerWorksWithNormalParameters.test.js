const request = require('supertest');
const app = require('../../App'); 
const mongoDb = require('../../managers/mongoManager');
jest.mock('../../managers/mongoManager');

let server;

beforeEach(() => {
  server = app.listen(4000);
});

afterEach(() => {
  server.close();
});

describe('POST /user/register', () => {
    it('should respond with a 201 status when credentials are valid', async () => {
      mongoDb.addUser.mockReturnValue({});
      const response = await request(app)
      .post('/user/register')
      .send({username: 'TestUser1', password: 'TestPassword1'});
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Created.');
    });
  });