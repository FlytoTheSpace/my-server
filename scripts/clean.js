const fs = require('fs');
const path = require('path');
const {logprefix} = require('../assets/logs');

const directoryPath = './server/public';

const deleteOldFiles = ()=>{
    console.log(`${logprefix('Cleaner')} Checking for Old Files to Delete...`)
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        const filePath = `${directoryPath}/${file}`;
        const stats = fs.statSync(filePath);
        const lastModifiedTime = stats.mtime.getTime();
        const currentTime = Date.now();
        const timeDifference = currentTime - lastModifiedTime;

        // Check if the file is older than 24 hours (24 * 60 * 60 * 1000 milliseconds)
        if (timeDifference > 24 * 60 * 60 * 1000) {
            // Delete the file
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
        }
    });
    console.log(`${logprefix('Cleaner')} Done!`)
}

// Export the function
module.exports = {deleteOldFiles};
