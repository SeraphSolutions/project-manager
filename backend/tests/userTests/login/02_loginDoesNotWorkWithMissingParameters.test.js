const request = require('supertest');
const app = require('@App'); 

const mongoDb = require('@managers/mongoManager');
jest.mock('@managers/mongoManager');

let server;

beforeEach(() => {
  server = app.listen(4000);
});

afterEach(() => {
  server.close();
});

describe('GET /user/login', () => {
  mongoDb.getUser.mockReturnValue({
        username: 'TestUser1',
        hashedPassword: '$2a$10$AYPl5DbEjtpSH3DIiXHXkuUODN79EOVZzu85ouCQVmGyJ1s3uwEEG'
      });

    it('should respond with a 400 status when username is missing', async () => {
      const response = await request(server)
      .get('/user/login')
      .send({password: 'TestPassword1'});
      expect(response.status).toBe(400);
      expect(response.badRequest).toBe(true);
    });

  it('should respond with a 400 status when password is missing', async () => {
    const response = await request(server)
    .get('/user/login')
    .send({username: 'TestUser1'});
    expect(response.status).toBe(400);
    expect(response.badRequest).toBe(true);
  });

  it('should respond with a 400 status when username and password are missing', async () => {
    const response = await request(server)
    .get('/user/login')
    .send({});
    expect(response.status).toBe(400);
    expect(response.badRequest).toBe(true);
  });
});