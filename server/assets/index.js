const fs = require('fs')
const path = require('path')

const AssetsFiles = fs.readdirSync(__dirname)

const FilteredFiles = AssetsFiles.filter((file)=>{
    let isJSFile = path.extname(file) == '.js' || path.extname(file) == '.cjs'
    return (file === "index.js") ? false : isJSFile
})
const FilesWithoutExt = FilteredFiles.map(file => {
    return file.replace(path.extname(file), '')
})

const Modules = {}

FilesWithoutExt.forEach(file=>{
    Modules[file[0].toUpperCase() + file.slice(1, file.length)] = require(`./${file}`)
})

module.exports = Modules