const mongoose = require('mongoose');

//connecting to MongoDB
const conn = async ()=>{
  try{
    await mongoose.connect(`${process.env.URI}`);
    console.log("Connected to MongoDB");
  }
  catch(error){
    console.error("Error connecting to MongoDB:", error);
  }
}

conn();