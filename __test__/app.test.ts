import supertest from 'supertest';
import { app } from '../src/server';
import { throwIfUndefined } from '../src/util';

const server = () => supertest(app);

const data = {
  name: 'Obi Chinedu Frank',
  github: '@FrankChinedu',
  email: 'frankieetchy@gmail.com',
  mobile: '07069297676',
  twitter: '@frankieetchy',
};

describe('NOT FOUND ROUTE', () => {
  it('Should return not found', async () => {
    const { body, status } = await server().get('/unknown');
    expect(status).toBe(404);
    expect(body.message).toBe('Route not found.');
    expect(body.status).toBe('error');
    expect(body.data).toBe(null);
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
  });

  it('Should throwIfUndefined', async () => {
    expect(throwIfUndefined).toThrow();
  });

  it('Should return env passed', async () => {
    process.env.PORT = '5000';
    const PORT = process.env.PORT;
    expect(throwIfUndefined(PORT, 'PORT')).toEqual('5000');
  });
});

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

  it(`If the field specified in the rule object is missing from the data passed`, async () => {
    const data = {
      rule: {
        condition: 'gte',
        condition_value: 30,
      },
      data: 'field',
    };
    const { body, status } = await server().post('/validate-rule').send(data);

    expect(status).toBe(400);
    expect(body.message).toBe('"rule.field" is required.');
    expect(body.status).toBe('error');
    expect(body.data).toBe(null);
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
  });

  it(`If the field specified in the rule object is missing from the data passed`, async () => {
    const data = {
      rule: {
        field: 'age',
        condition: 'gte',
        condition_value: 30,
      },
      data: {
        mission: 45,
      },
    };
    const { body, status } = await server().post('/validate-rule').send(data);

    expect(status).toBe(400);
    expect(body.message).toBe('field age is missing from data.');
    expect(body.status).toBe('error');
    expect(body.data).toBe(null);
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
  });

  it(`If the field specified in the rule object is missing from the data passed`, async () => {
    const data = {
      rule: {
        field: 'missions.count',
        condition: 'gte',
        condition_value: 30,
      },
      data: {
        name: 'James Holden',
        crew: 'Rocinante',
        age: 34,
        position: 'Captain',
        missions: {
          successful: 44,
          failed: 1,
        },
      },
    };
    const { body, status } = await server().post('/validate-rule').send(data);

    expect(status).toBe(400);
    expect(body.message).toBe('field missions.count is missing from data.');
    expect(body.status).toBe('error');
    expect(body.data).toBe(null);
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
  });

  it(`If the field specified in the rule object is missing from the data passed`, async () => {
    const data = {
      rule: {
        field: '5',
        condition: 'contains',
        condition_value: 'rocinante',
      },
      data: ['The Nauvoo', 'The Razorback', 'The Roci', 'Tycho'],
    };
    const { body, status } = await server().post('/validate-rule').send(data);

    expect(status).toBe(400);
    expect(body.message).toBe('field 5 is missing from data.');
    expect(body.status).toBe('error');
    expect(body.data).toBe(null);
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
  });

  it(`If the rule is successfully validated`, async () => {
    const data = {
      rule: {
        field: 'missions.count',
        condition: 'gte',
        condition_value: 30,
      },
      data: {
        name: 'James Holden',
        crew: 'Rocinante',
        age: 34,
        position: 'Captain',
        missions: {
          count: 45,
          successful: 44,
          failed: 1,
        },
      },
    };
    const { body, status } = await server().post('/validate-rule').send(data);

    expect(status).toBe(200);
    expect(body.message).toBe('field missions.count successfully validated.');
    expect(body.status).toBe('success');
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
    const dataKey = ['validation'];
    expect(Object.keys(body.data)).toEqual(dataKey);
    const validationKeys = [
      'error',
      'field',
      'field_value',
      'condition',
      'condition_value',
    ];
    expect(Object.keys(body.data.validation)).toEqual(validationKeys);
    const validation = body.data.validation;
    expect(validation.error).toBe(false);
    expect(validation.field).toBe('missions.count');
    expect(validation.field_value).toEqual(45);
    expect(validation.condition).toEqual('gte');
    expect(validation.condition_value).toEqual(30);
  });

  it(`If the rule is not successfully validated`, async () => {
    const data = {
      rule: {
        field: 'missions.count',
        condition: 'gte',
        condition_value: 30,
      },
      data: {
        name: 'James Holden',
        crew: 'Rocinante',
        age: 34,
        position: 'Captain',
        missions: {
          count: 15,
          successful: 44,
          failed: 1,
        },
      },
    };
    const { body, status } = await server().post('/validate-rule').send(data);

    expect(status).toBe(400);
    expect(body.message).toBe('field missions.count failed validation.');
    expect(body.status).toBe('error');
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
    const dataKey = ['validation'];
    expect(Object.keys(body.data)).toEqual(dataKey);
    const validationKeys = [
      'error',
      'field',
      'field_value',
      'condition',
      'condition_value',
    ];
    expect(Object.keys(body.data.validation)).toEqual(validationKeys);
    const validation = body.data.validation;
    expect(validation.error).toBe(true);
    expect(validation.field).toBe('missions.count');
    expect(validation.field_value).toEqual(15);
    expect(validation.condition).toEqual('gte');
    expect(validation.condition_value).toEqual(30);
  });

  it(`If the rule is not successfully validated 2`, async () => {
    const data = {
      rule: {
        field: '0',
        condition: 'eq',
        condition_value: 'a',
      },
      data: 'damien-marley',
    };
    const { body, status } = await server().post('/validate-rule').send(data);

    expect(status).toBe(400);
    expect(body.message).toBe('field 0 failed validation.');
    expect(body.status).toBe('error');
    const bodyKeys = ['message', 'status', 'data'];
    expect(Object.keys(body)).toEqual(bodyKeys);
    const dataKey = ['validation'];
    expect(Object.keys(body.data)).toEqual(dataKey);
    const validationKeys = [
      'error',
      'field',
      'field_value',
      'condition',
      'condition_value',
    ];
    expect(Object.keys(body.data.validation)).toEqual(validationKeys);
    const validation = body.data.validation;
    expect(validation.error).toBe(true);
    expect(validation.field).toBe('0');
    expect(validation.field_value).toEqual('d');
    expect(validation.condition).toEqual('eq');
    expect(validation.condition_value).toEqual('a');
  });
});
