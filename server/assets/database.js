require('dotenv').config();
const { logprefix } = require('./logs');
const mongoose = require('mongoose');


const mongodbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ServerDB';
mongoose.connect(mongodbURI, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log(`${logprefix('Database')} Connected to MongoDB!`);
});
const AccountsCollection = mongoose.model('Accounts', mongoose.Schema({
    username: String,
    email: String,
    password: String,
    userID: Number
}), 'accounts');
const userDataCollection = mongoose.model('userData', mongoose.Schema({
    userID: Number,
    preferences: Object,
    profilepic: String,
    bio: String
}), 'userData');
module.exports = {AccountsCollection, userDataCollection}