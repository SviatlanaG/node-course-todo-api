const{ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove()
// Todo.findByIdAndRemove()

Todo.findOneAndRemove({_id: '5b3b6cd5187f4fadd1313a42'}).then((todo) =>{

});

Todo.findByIdAndRemove('5b3b6cd5187f4fadd1313a42').then((todo) =>{
 console.log(todo);
});
