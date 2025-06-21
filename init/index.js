const Listing=require("../models/listing.js");
const mongoose = require('mongoose');
const initData= require("./data.js");

main().then( ()=>{
    console.log("conncetion success!!");
}).catch((err)=> console.log(err));


async function main() {
    await mongoose.connect('mongodb url');
  }

  const initDb= async  ()=>{
  await  Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialised");
  };
initDb();
