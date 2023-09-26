const fs = require("fs");

module.exports = {
    pathToProject: process.env.PATH_TO_PROJECT,
    options: {
        key: fs.readFileSync(process.env.KEY),
        cert: fs.readFileSync(process.env.CERT),
    },
    secret: process.env.WEBHOOK_SECRET,
};
