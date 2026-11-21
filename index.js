const express = require("express");
const loggerMiddleware = require("./middlewares/logger");
const authMiddleware = require("./middlewares/auth");
const errorMiddleware = require("./middlewares/error");
const morgan = require("morgan");
const app = express();
const fs = require("fs");
const path = require("path");
var jwt = require('jsonwebtoken');
var config = require("./config/config");
const connectDB = require("./config/db");
const User = require("./models/user");
const cors = require("cors");

var secretKey = config.secretKey;
connectDB();
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

// origin: "http://localhost:5173",

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(morgan("dev", { stream: accessLogStream }));
app.use(loggerMiddleware);
// app.use(errorMiddleware);

var users = [
    {
        id: 1,
        name: "karan",
    },
    {
        id: 2,
        name: "Laksha",
    },
];


app.get("/users", authMiddleware, async (req, res, next) => {
    // try {
    //     const error = new Error('Users not found!');
    //     throw error;
    //     res.json({
    //         status: "success",
    //         data: users
    //     })
    // } catch (error) {
    //     next(error);
    // }

    // const error = new Error('Users not found!');
    // throw error;

    // get users from database
    try {
        const users = await User.find();

        res.json({
            status: "success",
            data: users
        })
    } catch (error) {
        next(error);
    }


})
app.get("/users/:id", authMiddleware, (req, res) => {

    const idToRetrive = req.params.id;

    const [user] = users.filter((u) => { return u.id == idToRetrive });

    res.json({
        status: "success",
        data: user
    })
})



app.post("/users", async (req, res, next) => {
    const { srno, data, age } = req.body;
    // users.push({
    //     id: srno,
    //     name: data,
    //     age: age
    // })

    try {
        await User.create({
            id: srno,
            name: data,
            age: age
        })
        res.json({
            status: "success",
            message: "User added successfully"
        })
    } catch (error) {
        next(error);
    }
})

app.delete("/users/:id", async (req, res) => {

    const idToDelete = req.params.id;

    const result = await User.deleteOne({ id: idToDelete })

    if (result.deletedCount > 0) {
        res.json({
            status: "success",
            message: "User Deleted successfully"
        })
    } else {
        res.json({
            status: "error",
            message: "User not found"
        })
    }
})

app.put("/users/:id", async (req, res) => {

    const idToUpdate = req.params.id;
    const { name, age } = req.body;


    const userToUpdate = await User.findOne({ id: idToUpdate })


    if (userToUpdate) {
        userToUpdate.name = name;
        userToUpdate.age = age;
        await userToUpdate.save();
        res.json({
            status: "success",
            message: "User Updated successfully"
        })
    } else {
        res.json({
            status: "error",
            message: "User not found"
        });
    }


    // if (updatedUser) {
    //     res.json({
    //         status: "success",
    //         message: "User Updated successfully"
    //     })
    // } else {
    //     res.json({
    //         status: "error",
    //         message: "User not found"
    //     })
    // }
})

app.post("/login", (req, res) => {
    // check if username and password is correct
    var { username, password } = req.body;
    if (username == "laksha" && password == "laksha@123") {
        // if true, sign the JWT token

        const currentTime = new Date();
        const expiresAt = new Date(currentTime.getTime() + 1000 * 3600);
        var userToken = jwt.sign({ user: { email: "laksha@gmail.com", name: "laksha" }, expiresAt }, secretKey)

        res.json({
            status: "success",
            message: "Login Successfull!",
            data: {
                token: userToken
            }
        })
    } else {
        // if false, return response with error
        res.json({
            status: "error",
            message: "Invalid username or password"
        })
    }
})

app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Server is listening on port http://localhost:3000");
    }
})