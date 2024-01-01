const fs = require('fs');
const path = require('path');
const {logprefix} = require('../assets/logs');


const deleteOldFiles = ()=>{
    console.log(`${logprefix('Cleaner')} Checking for Old Files to Delete...`)
    let count = 0;

    const directories = ['./server/public/','./uploads/pdfs/'];

    directories.forEach(directory=>{
        const files = fs.readdirSync(directory);

        files.forEach(file => {
            const filePath = path.join(directory, file);
            const stats = fs.statSync(filePath);
            const lastModifiedTime = stats.mtime.getTime();
            const currentTime = Date.now();
            const timeDifference = currentTime - lastModifiedTime;

            // Check if the file is older than 24 hours (24 * 60 * 60 * 1000 milliseconds)
            if (timeDifference > 1 * 60 * 60 * 1000) {
                // Delete the file
                fs.unlinkSync(filePath);
                console.log(`${logprefix('Cleaner')} Deleted file: ${file}`);
                count++
            }
        });
    })
    console.log(`${logprefix('Cleaner')} Deleted Total ${count} files!`)
}

// Export the function
module.exports = {deleteOldFiles};
