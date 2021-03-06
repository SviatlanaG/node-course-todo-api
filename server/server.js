require('./config/config.js');

const _= require('lodash');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user')
var {authenticate} = require('./middleware/authenticate')
var app = express();

//heroku
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
//------------------------------POST
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (error) => {
    res.status(400).send(error);
  });
});
//------------------------------GET
app.get('/todos',authenticate, (req,res) => {
  Todo.find({
  _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (error) => {
    res.status(400).send(error);
  });
});
//----------------------------CET /id
app.get('/todos/:id',authenticate, (req, res) =>{
  // res.send(req.params);
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
  return res.status(404).send();
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo){
    return res.status(404).send();
    }
      res.send({todo});
  })
  .catch((error) => {
    res.status(400).send();
  });
});

  //----------------------------DELETE
app.delete('/todos/:id',authenticate, (req, res) =>{
 var id = req.params.id;
 if(!ObjectID.isValid(id)){
 return res.status(404).send();
 }
 Todo.findOneAndRemove({
   _id: id,
   _creator: req.user._id
 }).then((todo) =>{
   if(!todo){
     return res.status(404).send();
   }
   res.send({todo});
   // his line:
   // res.send(todo);
 })
 .catch((error) => {
   res.status(400).send();
 });
});

//------------------------------UPDATE
app.patch('/todos/:id',authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
   {_id: id, _creator: req.user._id},
   {$set: body},
   {new: true}
  ).then((todo)=> {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo: todo});
  }).catch((error) =>{
    res.status(400).send();
  });
});

//___________________________POST /users

//---------------------------v1.
// app.post('/users', (req, res) => {
//   var user = new User({
//     email: req.body.email,
//     password: req.body.password
//   });
//     user.save().then((doc) => {
//     res.send(doc);
//   }, (error) => {
//     res.status(400).send(error);
//   });
// });
//----------------------------v2.

// ________________________POST user v1
// app.post('/users', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var user = new User(body);
//
// // User.findByToken
// // user.generateAuthToken
//
//     user.save().then((user) => {
//     res.send(user);
//   }).catch((error) => {
//     res.status(400).send(error);
//   })
// });

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

    user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((error) => {
    res.status(400).send(error);
  })
});

app.get('/users/me', authenticate, (req, res) => {
      res.send(req.user);
});


app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
    }).catch((error) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Started up at port ${port}.`);
});

module.exports = {app};
