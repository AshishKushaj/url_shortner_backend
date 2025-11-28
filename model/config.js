const mg= require('mongoose')

const connectDB= async ()=>{
    try{
        await mg.connect(process.env.DB)
        console.log("db connected")
    }
    catch(err){
        console.log("err in connecting to DB",err)
    }
}

module.exports =  {connectDB} 