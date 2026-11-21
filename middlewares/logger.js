const fs = require("fs");

const loggerMiddleware = (req, res, next) => {
    var log = `${new Date().toISOString()} ${req.method} ${req.url} \n`;    
    fs.appendFileSync("log.txt", log);
    next();
}

module.exports = loggerMiddleware;