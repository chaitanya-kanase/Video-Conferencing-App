const express = require("express");
const mongoose = require("mongoose");
const userRouter = require ("./routes/user.router.js");
const { createServer} = require ("node:http");

const connectToSocket = require ("./controller/socketManager.js");

const cors = require ("cors");
const { create } = require ("node:domain");

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port" , (process.env.PORT || 8000));

app.use(cors());
app.use(express.json());
app.use("/api/v1/users",userRouter)

const start = async ()=>{
    const Mongo_URL = "mongodb://ckanase93_db_user:chetan1234@ac-uznkny0-shard-00-00.mlgku6l.mongodb.net:27017,ac-uznkny0-shard-00-01.mlgku6l.mongodb.net:27017,ac-uznkny0-shard-00-02.mlgku6l.mongodb.net:27017/?ssl=true&replicaSet=atlas-5bc6wm-shard-0&authSource=admin&appName=Cluster0";

    const connectionDb  = await mongoose.connect(Mongo_URL);
    console.log("Connected to db");
    server.listen(app.get("port"),()=>{
        console.log("listening on Port 8000");
    })
}

start();