const express = require('express');
let bodyparse = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const { errorHandler } = require("./middlewares/error-handler.middleware")
const { routeNotFound } = require("./middlewares/route-not-found.middleware");
const { verifyAuth } = require("./middlewares/verifyAuth.middleware")


const login=require("./routes/login.router.js");
const signup=require("./routes/signup.router.js");
const user=require("./routes/user.router.js");
const posts=require("./routes/post.router.js");
const suggestion=require("./routes/suggestion.router.js")
const search=require("./routes/search.router.js")
app.use(bodyparse.json())
app.use(cors());


//mongoose conn
mongoose.connect(process.env.DB_Secret,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{console.log("mongoose connected")}).catch(eror=>{console.log("mongoose connection problem",error)})

app.get("/", (req, res) => {
  res.send("kisan-connect backend")
})

app.use('/login',login);
app.use('/signup',signup)
app.use('/posts',verifyAuth,posts);
app.use("/user",verifyAuth,user);
app.use("/suggestion",verifyAuth,suggestion);
app.use("/search",search);
app.use(routeNotFound);
app.use(errorHandler);

const port=process.env.PORT || 3100
app.listen(port, () => {
  console.log('server started');
});