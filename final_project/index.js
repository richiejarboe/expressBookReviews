const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const auth_routes = require('./router/auth_users.js');
const customer_routes = auth_routes.authenticated;
const login = auth_routes.login;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

const customerSession = session({
    secret:"fingerprint_customer",
    resave: true,
    saveUninitialized: true
});

app.use("/customer", customerSession);
app.use("/login", customerSession);

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
  if(req.session.authorization) {
    const token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
      if(!err){
        req.user = user;
        next();
      }
      else{
        return res.status(403).json({message: "User not authenticated"})
      }
    });
  } else {
    return res.status(403).json({message: "User not logged in"})
  }
});
 
const PORT =5000;

app.post("/login", login);
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));