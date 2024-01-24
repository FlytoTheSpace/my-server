import 'dotenv/config';
import { logprefix } from './logs';
import mongoose from 'mongoose';


const mongodbURI: string = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ServerDB';
mongoose.connect(mongodbURI, {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log(`${logprefix('Database')} Connected to MongoDB!`);
});

// Define your schemas using SchemaDefinition
const AccountSchemaDef: mongoose.SchemaDefinition = {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    userID: { type: Number, required: true }
};

const userDataSchemaDef: mongoose.SchemaDefinition = {
    userID: { type: Number, required: true },
    preferences: { type: Object, required: true },
    profilepic: { type: String, required: false },
    bio: { type: String, required: false }
};

const AccountSchema = new mongoose.Schema(AccountSchemaDef);
const UserDataSchema = new mongoose.Schema(userDataSchemaDef);

export const AccountsCollection = mongoose.model('Accounts', AccountSchema, 'accounts');
export const userDataCollection = mongoose.model('userData', UserDataSchema, 'userData');