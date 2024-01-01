const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');
const { LocalIPv4 } = require('./ip');
const udpPort = 3001; // UDP port for broadcasting
const subnetMask = '255.255.255.0';
const {logprefix} = require('./logs')

// Function to calculate the broadcast address
function calculateBroadcastAddress(ip, netmask) {
    const ipArray = ip.split('.').map(Number);
    const netmaskArray = netmask.split('.').map(Number);
    const broadcastArray = ipArray.map((num, idx) => num | (~netmaskArray[idx] & 255));
    return broadcastArray.join('.');
}

// Function to broadcast a message
function broadcastMessage(message) {
    const messageBuffer = Buffer.from(message);
    const localIp = LocalIPv4();
    const broadcastAddr = calculateBroadcastAddress(localIp, subnetMask);

    udpServer.send(messageBuffer, 0, messageBuffer.length, udpPort, broadcastAddr, (err) => {
        if (err) {
            console.error(`${logprefix('BroadCast')} Error broadcasting message: ${err}`);
        } else {
            console.log(`${logprefix('BroadCast')} Broadcasted: ${message}`);
        }
    });
}
udpServer.bind(() => {
    udpServer.setBroadcast(true);
});
module.exports = { calculateBroadcastAddress, broadcastMessage }