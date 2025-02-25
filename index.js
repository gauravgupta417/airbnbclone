const express= require("express");
const mongoose = require('mongoose');
const app=express();
const path=require("path");
const methodOverride= require('method-override');
const ejsMate= require('ejs-mate');
const just=require("./utils/just.js");
const ExpressError=require("./utils/ExpressError.js")
const Review=require("./models/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const Listing=require("./models/listing.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
require('dotenv').config();

app.engine("ejs",ejsMate);
app.use(methodOverride("_method"));
app.set("viewengine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public")));
const dburl = process.env.ATLASDB_URL;
const store=MongoStore.create({
  mongoUrl:dburl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error",()=>{
  console.log("error in mongo session store",err);
});
const sessionOptions={
  store,
secret:process.env.SECRET,
resave:false,
saveUninitialized:true,
cookie:{
expires:Date.now()+ 7*24*60*60*1000,
maxAge:7*24*60*60*1000,
httpOnly:true,
},
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
     next();
 });

// 'mongodb://127.0.0.1:27017/wanderlust'
//  const dburl = process.env.ATLASDB_URL;
console.log(dburl);
async function main() {
    await mongoose.connect(dburl);
  }


  main().then( ()=>{
    console.log("conncetion success!!");
}).catch((err)=> console.log(err));


  app.listen(8080, ()=>{
    console.log("listening on port 8080");
})

// Listing.findByIdAndDelete('679fa5dd28b4f28fa9bab98f').then((res)=>{
//     console.log("deleted");
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/", userRouter);

// app.get("/",(req,res)=>{
//   res.send("root chal rhi h");
// });

app.get("/search", async (req, res) => {
  try {
    const query = req.query.query || req.query.q || "";


      if (!query) {
          return res.status(400).json({ error: "Query parameter is required" });
      }

      console.log("Search Query:", query);

      const listings = await Listing.find({
          $or: [
              { name: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } }
          ]
      });

      res.json({ listings });
  } catch (error) {
      console.error("Error during search:", error);
      res.status(500).json({ error: error.message || "Search failed" });
  }
});


app.all("*",(req,res,next)=>{
       next(new ExpressError(404,"page not found!!"));
});
app.use((err,req,res,next)=>{
  let{statuscode=500,message="something went wrong!!"}=err;
res.status(statuscode).render("./listings/error.ejs",{err});
});




 