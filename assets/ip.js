const os = require('os');

const LocalIPv4 = ()=>{
    const interfaces = os.networkInterfaces();
    for (const key in interfaces) {
        for (const iface of interfaces[key]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return null;
};

module.exports = {LocalIPv4};