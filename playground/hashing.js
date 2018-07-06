const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (error, salt) => {
//   bcrypt.hash(password, salt, (error, hash) => {
//     console.log(hash);
//   })
// });


var hashedPassword = '$2a$10$NRSvNW3PkB2awixSajsCHOft8jZpqMbmzmSRmnOawBT1cB4lrDf1q';

bcrypt.compare('password', hashedPassword, (error, result) => {
  console.log(result);
});












// var data = {
//   id: 14
// };
//
// var token = jwt.sign(data, 'ads123');
// console.log(token);
// var decoded = jwt.verify(token, 'ads123');
// console.log('decoded' , decoded);



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
