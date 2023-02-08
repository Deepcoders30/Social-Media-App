const express=require("express");
const dotenv=require("dotenv");
dotenv.config("./.env");
const DBconnect=require("./DBconnect.js");
const authRouter=require("./routers/authRouter.js");
const postsRouter=require("./routers/postsRouter.js");
const userRouter=require("./routers/userRouter.js");
const morgon=require("morgan");
const cookieParser=require("cookie-parser");
const cors=require("cors");


const app=express();

//Middlewares
app.use(express.json());
app.use(morgon('common'));   
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));


app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);        
app.get("/", (req, res)=>{
    res.status(200).send("OK from Server");
});

const PORT_NO = process.env.PORT || 4000;


DBconnect();
app.listen(PORT_NO, ()=>{
    console.log(`Listening on PORT: ${PORT_NO}`);
});