const express = require('express')
const app= express()
const {connectDB} = require("./model/config");
const {router} = require('./router/router_url')
const cors = require("cors");
const PORT= process.env.PORT;

app.use(express.json())
app.use(cors());
require("dotenv").config();

app.use('/',router)



app.listen(PORT, () => {
  console.log(`listing on ${PORT}`);
});


const connectToDB=async ()=>{
    await connectDB()
}
connectToDB();

