const { UIMSG_1 } = require('./UI_messages');
const SendMSG = (msg, statusCode = 500, res, API=false) => {
    return res.status(statusCode).send((API) ? msg : UIMSG_1(msg))
}

module.exports = SendMSG