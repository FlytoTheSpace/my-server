import { UIMSG_1 } from './UI_messages';

const SendMSG = (msg: string , statusCode: number = 500, res: any, API:boolean=false) => {
    return res.status(statusCode).send((API) ? msg : UIMSG_1(msg))
}

export default SendMSG;