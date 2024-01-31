import fs from 'fs';
import path from 'path';

const AssetsFiles = fs.readdirSync(__dirname);

const FilteredFiles = AssetsFiles.filter((file) => {
    let isJSFile = path.extname(file) === '.js' || path.extname(file) === '.cjs';
    return (file === "index.js") ? false : isJSFile;
});

const FilesWithoutExt = FilteredFiles.map(file => file.replace(path.extname(file), ''));

interface ModulesInterface {
    [key: string]: any; // You might want to replace 'any' with a more specific type
}

const Modules: ModulesInterface = {};

FilesWithoutExt.forEach(file => {
    const moduleName = file[0].toUpperCase() + file.slice(1);
    Modules[moduleName] = require(`./${file}`); // Dynamic import might be needed for full ESNext compliance
});

export default Modules;
