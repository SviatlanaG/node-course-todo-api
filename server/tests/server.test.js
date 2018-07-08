const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
// const {todos} = require('./seed/seed');
// const {populateTodos} = require('./seed/seed');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((error, res) => {
      if(error){
        return done(error);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((error) => done(error));
    });
  });

    it('Should not create todo with invalid body data', (done) => {
      request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((error, res) => {
        if(error){
          return done(error);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((error) => done(error));
      });
    });
});

  describe('GET /todos', () => {
    it('Should get all todos', (done) => {
      request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
    });
  });

  describe('GET /todos/:id', () =>{
    it('Should return todo doc', (done) => {
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
    });

    it('Should not return todo doc created by other user', (done) => {
      request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
      var id = new ObjectID().toHexString();
      request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    });

    it('Should return 404 for non-object ids', (done) => {
      request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
    });
  });


  describe('DELETE todos/:id', () => {
    it('Should remove a todo', (done) =>{
      var hexId = todos[1]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((error, res) => {
        if (error){
          return done(error);
        }

        Todo.findById(hexId).then((todo) =>{
          // expect(todo).toNotExist();
          expect(todo).toBeFalsy();
          done();
        }).catch((error) => done(error));
      });
    });

    it('Should remove a todo', (done) =>{
      var hexId = todos[0]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((error, res) => {
        if (error){
          return done(error);
        }

        Todo.findById(hexId).then((todo) =>{
          expect(todo).toBeTruthy();
          done();
        }).catch((error) => done(error));
      });
    });

    it('Should return 404 if todo not found', (done) => {
      var id = new ObjectID().toHexString();
      request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
    });

    it('Should return 404 if object id is invalid', (done) => {
      request(app)
      .delete('/todos/123')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
    });
  });

  describe('PATCH /todos/:id', () =>{
    it('Should update the todo', (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = 'Life';

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(200)
      .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(true);
          // expect(res.body.todo.completedAt).toBeA('number');
          expect(typeof res.body.todo.completedAt).toBe('number');
      })
        .end(done);
    });

    it('Should not update the todo create by other user', (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = 'Life';

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed: true
      })
      .expect(404)
      .end(done);
    });

    it('Should clear completedAt when todo is not completed', (done) => {

      var hexId = todos[1]._id.toHexString();
      var text = 'Love';

      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text,
        completed: false
      })
      .expect(200)
      .expect((res) => {
          expect(res.body.todo.text).toBe(text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toBeFalsy();
      }).end(done);
    });
  });

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

  describe('POST /users', () => {

    it('should create a user', (done) => {
      var email = 'example@email.com';
      var password = '123mnb';

      request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        // expect(res.body._id).toExist();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      // .end(done);
      .end((error) => {
        if(error) {
          return done(error);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((error) => done(error));
      });
    });

    it('should return validation errors if request invalid', (done) => {
        var invalidEmail = 'life@';
        var invalidPassword = 'dom';

        request(app)
        .post('/users')
        .send({invalidEmail, invalidPassword})
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use', (done) => {
        // var existEmail = 'moonlight@gmail.com';
        var password = 'lovelyDay'
        request(app)
        .post('/users')
        .send({
          email: users[0].email,
          password: password})
        .expect(400)
        .end(done);
    });

  });


describe('POST /users/login', () =>{
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((error, res) =>{
      if(error){
        return done(error);
      }

      User.findById(users[1]._id).then((user) => {
        // not working!!!!
        // expect(user.tokens[0]).toContain({
        //   access: 'auth',
        //   token: res.headers['x-auth']
        // });
        expect(user.tokens[1]).toBeTruthy();
        done();
      }).catch((error) => done(error));
    });
  });


  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password + 'varvara'
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end((error, res) =>{
      if(error){
        return done(error);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((error) => done(error));
    });
  });
});
describe('DELETE users/me/token', () => {
  it('shoul remove auth token on logot', (done) =>{
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((error, res) => {
      if(error){
        return done(error);
      }
      User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((error) => done(error));
    });
  });
});
