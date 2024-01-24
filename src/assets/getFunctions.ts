import env from './dotenv'
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Cryptr from 'cryptr';
import { LoginfoDecryptionKey } from '../common/KEYS'
import { TokenPayload } from './interfaces';

export const getUserID = (token: string)=>{
    const userID = (jwt.verify(token, env('ACCOUNTS_TOKEN_VERIFICATION_KEY')) as TokenPayload).userID;
    return userID;
}
export const getUsername = (token: string)=>{
    const Username = (jwt.verify(token, env('ACCOUNTS_TOKEN_VERIFICATION_KEY')) as TokenPayload).username;
    return Username;
}
export const getEmail = (token: string)=>{
    const Email = (jwt.verify(token, env('ACCOUNTS_TOKEN_VERIFICATION_KEY')) as TokenPayload).email;
    return Email;
}
export const getRole = (token: string)=>{
    const Role = (jwt.verify(token, env('ACCOUNTS_TOKEN_VERIFICATION_KEY')) as TokenPayload).role;
    return Role;
}