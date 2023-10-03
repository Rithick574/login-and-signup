const express=require('express')
const routes = require('./router');
const morgan=require('morgan')
const path=require('path')
const dotenv=require('dotenv')
const connectDB=require("./server/database/connection");
const session=require("express-session")
const nocache = require("nocache");

//config env
dotenv.config({path:'.env'})

const app=express()
app.set('view engine','ejs')

//port
const PORT=process.env.PORT || 8080

//log request morgan
app.use(morgan('tiny'));


//to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




//style
app.use("/static", express.static(path.join(__dirname, "public")));





//nocache
app.use("/",nocache());


//session

app.use(
    session({
      secret: "uuidv4",
      resave: false,
      saveUninitialized: false,
    })
  );






//mongodb connection
connectDB();


app.use('/',routes)


app.listen(PORT,()=>{
    console.log(`hosted in http://localhost:${PORT}`);
})