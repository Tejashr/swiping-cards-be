const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const URL = "mongodb+srv://tejas:Tejas11@cluster0.vpuuy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const DB = "swiping-cards";

app.use(cors())
app.use(express.json());

//registering the user 

app.post("/register", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        //fetching if user is present or not

        let uniquePhone = await db.collection("users").findOne({ phone: req.body.phone });

        if (uniquePhone) {
            res.json({
                message: "phone number already exist"
            })
        } else {
            let users = await db.collection("users").insertOne(req.body);

            await connection.close();
            res.json({
                message: "User Registerd"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

//logging the user

app.post("/login", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);

        let user = await db.collection("users").findOne({ phone: req.body.phone })
        let message=0;
        
        //if user is registered or not
        if (user) {
           
            if (user.otp=="0000") {
                res.json({
                    message
                })
            } else {        //if otp is incorrect
                res.json({
                    message: "otp is incorrect"
                })
            }
        } else {
            res.json({
                message: "phone number is not registered"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

//getting user by id

app.get("/users/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let user = await db.collection("users").findOne({ _id: mongodb.ObjectID(req.params.id) })
        res.json(user)
        await connection.close();
    } catch (error) {
        console.log(error)
      
    }
})

//getting user by phone number

app.get("/user/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let user = await db.collection("users").findOne({ phone: req.params.id })
        res.json(user)
        await connection.close();
    } catch (error) {
        console.log(error)
      
    }
})

// posting the history 

app.post("/history", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        await db.collection("history").insertOne(req.body);
        await connection.close();
        res.json({
            message: "history created"
        })
    } catch (error) {
        console.log(error)
    }
})

//fetching history by user id

app.get("/history/:id", async function (req, res) {
    try {
        let connection = await mongodb.connect(URL);
        let db = connection.db(DB);
        let history =await db.collection("history").find({phone:req.params.id}).toArray();
        res.json(history)
        await connection.close();
    } catch (error) {
        console.log(error)
    }
})

app.listen(process.env.PORT || 5000)