const{ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

// var id = '5b3a7f58116a6de602bc8f145';
//
// if(!ObjectID.isValid(id)){
// console.log('ID not valid!');
// }
// Todo.find({
//   _id: id
// }).then((todos) =>{
//   console.log('Todos: ', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo: ', todo);
// })

// Todo.findById(id).then((todo) =>{
//   if(!todo){
//     return console.log('Id not found!');
//   }
//   console.log('Todo By Id: \n', todo);
// }).catch((error) => console.log(error));


const{User} = require('./../server/models/user');

var id = '5b3a9f21187f4fadd1312b1b';

// User.findById(id).then((user) =>{
//   if(!user){
//     return console.log('User not found!');
//   }
//   console.log('User By ID: \n', user);
// }).catch((err) => console.log(err));

//his version:
User.findById(id).then((user) =>{
  if(!user){
    return console.log('User not found!');
  }
  console.log(JSON.stringify(user, undefined, 2));
}, (error) => {
  console.log(error);
});
