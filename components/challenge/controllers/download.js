let path = require('path');
const fs = require('fs');

const { fileName: fileNameValidation } = require('../challenge.validate');

async function downloadFile(req, res) {
    try {
        req.body.fileName = req.params.name;
        const { error, value } = fileNameValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });

        const fileName = value.fileName;
        const file = path.join(__dirname, '../../../', 'downloads/' + fileName);

        fs.access(file, fs.F_OK, (err) => {
            if (err) return res.status(404).json({ error: 'file not here' });
            // file exists
            res.download(file); // Set disposition and send it.
        });
    } catch (err) {
        return res.status(500).send({ message: "Internal server error" });
    }
};

module.exports = downloadFile;