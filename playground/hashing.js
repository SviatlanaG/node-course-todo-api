const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 14
};

var token = jwt.sign(data, 'ads123');
console.log(token);
var decoded = jwt.verify(token, 'ads123');
console.log('decoded' , decoded);



// var message = 'I am user nubmer 1';
// var hash = SHA256(message).toString();
//
// console.log(`Message is ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// //______________Data changed_________________________
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
// //_____________________________________________________
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust!');
// }
