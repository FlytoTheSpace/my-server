import mongoose from 'mongoose';
import('./database');
export interface TokenPayload {
    username: string,
    email: string,
    password: string,
    userID: number,
    role: string
}
export type TokenPayloadType = {
    username: string,
    email: string,
    password: string,
    userID: number,
    role: string
};
export type AccountsCollection = ({
    _id: mongoose.ObjectId,
    username: string,
    email: string,
    password: string,
    userID: number,
    role: 'member' | 'admin',
    __v: 0
})[]
export interface AuthenticateInterface {
    isTokenCorrupt: Function,
    isValidAccount: Function,
    isAdmin: Function,
    byToken: Function,
    byTokenAdminOnly: Function,
    byTokenAPI: Function,
    byTokenAdminOnlyAPI: Function
    none: Function
}
