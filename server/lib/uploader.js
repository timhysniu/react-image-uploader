const fs = require('fs');
const uuid = require('node-uuid');
const Promise = require('bluebird');

const handleUpload = function (uploadData, options) {
    if (!uploadData) reject(new Error('no file'));

    return new Promise((resolve, reject) => {
        try {
            const filename = uuid.v4();
            const tmpPath = uploadData.path;
            const extension = uploadData.filename.split('.').pop().toLowerCase();
            const newFile = `${filename}.${extension}`;
            const newPath = `${options.dest}/${newFile}`;

            fs.copyFileSync(tmpPath, newPath);
            fs.unlink(tmpPath, () => {});
            resolve(newFile);
        }
        catch(err) {
            reject(err);
        }
    });
}

const handleDelete = function(filePath) {
    return new Promise((resolve, reject) => {
        try {
            fs.unlink(filePath, () => {});
            resolve(true);
        }
        catch(err) {
            reject(err);
        }
    });
}

module.exports = { handleUpload, handleDelete };
