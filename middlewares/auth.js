const config = require("../config/config");
const jwt = require("jsonwebtoken");
const secretKey = config.secretKey;

const authMiddleware = (req, res, next) => {

    if(!req.headers.authorization){
        res.status(401).send({
            status: "error",
            message: "Unauthorized"
        })
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
        var decoded = jwt.verify(token, secretKey);
        var isExpired = new Date(decoded.expiresAt).getTime() < new Date().getTime();
        console.log(new Date(decoded.expiresAt).getTime())
        console.log(new Date().getTime())
        if(isExpired){
            res.status(401).send({
                status: "error",
                message: "Token expired"   
            })
        }else{
            next();
        }
    } catch (error) {
        res.status(401).send({
            status: "error",
            message: "Unauthorized"
        })
    }

    // if (token === "1234567890") {
    //     next();
    // } else {
    //     res.status(401).send({
    //         status: "error",
    //         message: "Unauthorized"
    //     })
    // }
}

module.exports = authMiddleware;