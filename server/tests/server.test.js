const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
// const {User} = require('./../models/user');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
    _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 49
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
  return Todo.insertMany(todos);
}).then(() => done());
});

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
    });
  });

  describe('GET /todos/:id', () =>{
    it('Should return todo doc', (done) => {
      request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
      var id = new ObjectID().toHexString();

      request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
    });

    it('Should return 404 for non-object ids', (done) => {
      request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
    });
  });


  describe('DELETE todos/:id', () => {
    it('Should remove a todo', (done) =>{
      var hexId = todos[0]._id.toHexString();

      request(app)
      .delete(`/todos/${hexId}`)
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

    it('Should return 404 if todo not found', (done) => {
      var id = new ObjectID().toHexString();
      request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
    });

    it('Should return 404 if object id is invalid', (done) => {
      request(app)
      .delete('/todos/123')
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

    it('Should clear completedAt when todo is not completed', (done) => {

      var hexId = todos[0]._id.toHexString();
      var text = 'Love';

      request(app)
      .patch(`/todos/${hexId}`)
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
