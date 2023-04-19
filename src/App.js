import dotenv from 'dotenv'
import express from "express";
import { __dirname, __filename } from "./path.js";
import routerProduct from "./routes/products.routes.js";
import routerCart from "./routes/carts.routes.js";
import realTimeProducts from "./routes/realTimeProducts.routes.js";
import routerSocket  from "./routes/socket.routes.js";
import routerUser from "./routes/user.routes.js";
import routerSession from "./routes/session.routes.js";
import routerGithub from "./routes/github.routes.js"
import { engine } from "express-handlebars";
import * as path from "path";
import {Server} from "socket.io"
import { getManagerMessages } from "./dao/daoManager.js";
import mongoose from "mongoose";
import session from 'express-session'
import MongoStore from 'connect-mongo'
import bodyParser from 'body-parser'
import passport from 'passport';
import initializePassport from './config/passport.js'


const app = express();
const PORT = 8080;
dotenv.config();
const server =app.listen(PORT, () => {
  console.log(`Server on Port ${PORT}`);
});


try {
  await mongoose.connect("mongodb://javesfri:coderhouse@ac-s7myrez-shard-00-00.9bhthja.mongodb.net:27017,ac-s7myrez-shard-00-01.9bhthja.mongodb.net:27017,ac-s7myrez-shard-00-02.9bhthja.mongodb.net:27017/?ssl=true&replicaSet=atlas-x8xyi0-shard-0&authSource=admin&retryWrites=true&w=majority")
  console.log("DB is connected")
} catch (error) {
  console.log(error) 
}

//ServerIO
const io=new Server(server)



io.on("connection", (socket) =>{ //io.on cuando se establece conexion 
  console.log("Cliente Conectado")
  socket.on("message", async (info) =>{
    const data= await getManagerMessages()
    const managerMessage = new data.ManagerMessageMongoDB
    managerMessage.addElements(info).then(() =>{
      managerMessage.getElements().then((messages) =>{
        console.log(messages[messages.length-1]);
        socket.emit("allMessages", messages)
      })
    })
  })


})



//HBS
app.get("/",  (req, res) => {
  res.render("home", {});
});


app.use(session({
  store: MongoStore.create({
      mongoUrl: process.env.URLMONGODB,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 90
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))




//Middlewares
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
initializePassport()
app.use(passport.initialize())
app.use(passport.session())




//Routes
app.use("/static", express.static(__dirname + "/public"));
app.use("/", express.static(__dirname + "/public"));
app.use("/api/products", routerProduct);
app.use("/api/carts", routerCart);
app.use("/realtimeproducts",realTimeProducts);
app.use("/chat",routerSocket)
app.use('/user/', routerUser)
app.use('/api/session/', routerSession)
app.use('/authSession/', routerGithub)




