const GenRandomChar = (Length)=>{
    const chars = `1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
    let randomCharString = "";
    for (let i = 0; i <=Length; i++) {
        let randomNum = Math.floor(
            Math.random() * chars.length
        )
        randomCharString += chars[randomNum]
    }
    return randomCharString.slice(0, randomCharString.length -1)
}
module.exports = GenRandomChar;