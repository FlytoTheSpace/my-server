const logprefix = (filename) => {
    return `[${filename[0].toUpperCase() + filename.slice(1, filename.length)}] [${new Date().toLocaleTimeString()}]`
}

module.exports = {logprefix}