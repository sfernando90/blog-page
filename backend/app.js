const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

const DbKey = 'KPjD8dobbo5O6tuy'

mongoose.connect('mongodb+srv://Fernando:KPjD8dobbo5O6tuy@cluster0.9b4na.mongodb.net/node-angular?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
  console.log('Connected to database!');
}).catch(()=>{
  console.log('Connection to database failed');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("images")));


app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);

module.exports = app;
