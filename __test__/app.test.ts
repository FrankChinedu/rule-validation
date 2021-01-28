import supertest from 'supertest';
import { app } from '../src/server';

const server = () => supertest(app);

const data = {
  name: 'Obi Chinedu Frank',
  github: '@FrankChinedu',
  email: 'frankieetchy@gmail.com',
  mobile: '07069297676',
  twitter: '@frankieetchy',
};

const validate = {
  rule: {
    field: 'missions',
    condition: 'gte',
    condition_value: 30,
  },
  data: {
    name: 'James Holden',
    crew: 'Rocinante',
    age: 34,
    position: 'Captain',
    missions: 45,
  },
};

describe('GET', () => {
  it('should get my details', async () => {
    const { body, status } = await server().get('/');
    expect(status).toBe(200);
    expect(body.message).toBe('My Rule-Validation API');
    expect(body.status).toBe('success');
    expect(body.data.name).toBe(data.name);
    expect(body.data.github).toBe(data.github);
    expect(body.data.email).toBe(data.email);
    expect(body.data.mobile).toBe(data.mobile);
    expect(body.data.twitter).toBe(data.twitter);
    const bodyKeys = ['message', 'status', 'data'];
    const dataKeys = ['name', 'github', 'email', 'mobile', 'twitter'];
    expect(Object.keys(body)).toEqual(bodyKeys);
    expect(Object.keys(body.data)).toEqual(dataKeys);
    expect(body).toMatchSnapshot();
  });
});

describe('POST', () => {
  it(`If a required field isn't passed. Your endpoint should return with a response (HTTP 400 status code)`, async () => {
    const { body, status } = await server().post('/validate-rule').send({});
    expect(status).toBe(400);
    expect(body.message).toBe('rule is required.');
    expect(body.status).toBe('error');
    expect(body.data).toBe(null);
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
  });

  it(`If a required field isn't passed. Your endpoint should return with a response (HTTP 400 status code)`, async () => {
    const { body, status } = await server().post('/validate-rule').send({
      rule: {},
    });
    expect(status).toBe(400);
    expect(body.message).toBe('data is required.');
    expect(body.status).toBe('error');
    expect(body.data).toBe(null);
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
  });

  it(`if the rule field is passed as a number instead of a valid object`, async () => {
    const { body, status } = await server().post('/validate-rule').send({
      rule: 4,
      data: '',
    });
    expect(status).toBe(400);
    expect(body.message).toBe('rule should be an object.');
    expect(body.status).toBe('error');
    expect(body.data).toBe(null);
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
  });

  it(`if the rule field is passed as a number instead of a valid object`, async () => {
    const { body, status } = await server().post('/validate-rule').send({
      rule: {},
      data: 4,
    });
    expect(status).toBe(400);
    expect(body.message).toBe('data should be an object | string | array.');
    expect(body.status).toBe('error');
    expect(body.data).toBe(null);
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
  });

  it(`If an invalid JSON payload is passed to your API`, async () => {
    const { body, status } = await server()
      .post('/validate-rule')
      .send('{"invalid"}')
      .type('json');
    expect(status).toBe(400);
    expect(body.message).toBe('Invalid JSON payload passed.');
    expect(body.status).toBe('error');
    expect(body.data).toBe(null);
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
  });
});
