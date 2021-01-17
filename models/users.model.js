const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UsersSchema = new Schema({
  UserName: {
    type: String,
    required: true,
    min: 5,
  },
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  EmailAddress: {
    type: String,
    required: true,
    max: 8,
  },
  Password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  favorites: [
   String,
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
const Users = mongoose.model('Users', UsersSchema);
module.exports = Users;
