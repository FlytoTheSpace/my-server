const path = require('path')
const fs = require('fs')
const ROOT = require('./assets/root')
const GetABCChars = () => {
    const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

    Count = 24

    for (let i = 0; i <= Count; i++) {
        console.log(chars[i])
    }
}
// GetABCChars()

// (async () => {
//     const Filetxt = fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8')
//     const File = Buffer.from(Filetxt)
//     console.log(File)
//     fs.writeFileSync(path.join(ROOT, 'config2.json'),File)
// })()

// const buf = Buffer.from("Hello World");
// console.log(buf) // <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
// console.log(buf.toString('utf8')); // "Hello Wolrd"

// buf.write("Hi", 0); // Overwrites the buffer with "Hi" at the beginning
// console.log(buf) // <Buffer 48 69 6c 6c 6f 20 57 6f 72 6c 64>
// console.log(buf.toString('utf8')) // Hillo World

