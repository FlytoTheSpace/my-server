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