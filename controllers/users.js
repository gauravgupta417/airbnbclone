const User=require("../models/user");

module.exports.rendersignup= async(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res)=>{
 try{
  let {username,email,password}=req.body;
  const newUser=new User({email,username});
 const registeredUser=await User.register(newUser,password);
 console.log(registeredUser);
 req.login(registeredUser, (err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","Welcome to Wanderlust!");
 res.redirect("/listings");
 });
 
 }catch(err){
  req.flash("error",err.message);
  res.redirect("/signup");
 }
};
module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login= async(req,res)=>{
    req.flash("success","Welcome to Wanderlust,you are logged in!");
    let ourredirecturl=res.locals.redirectUrl || "/listings";   //agr home page se reqst bhejenge to /listings pr jayga else same
    res.redirect(ourredirecturl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","you are successfully logged out!");
      res.redirect("/listings");
    })
  
};