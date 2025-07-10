const express= require("express");
const app=express();
const userRoutes=require("./Routers/userRoutes.js")
const postRoutes=require("./Routers/postRoutes.js")
const mongoose = require('mongoose');
const path=require('path');
var cors = require('cors');
require('dotenv').config();

  try {
   mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoSelectFamily: false, // fix for IPv6 handshake issues
})
    .then(() => console.log('Connected!'));
  } catch (error) {
    console.log('error in connecting to mongodb'+error);
  }

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

app.use(cors());
app.use(express.json());

const helmet = require('helmet');
app.use(helmet());

app.use(userRoutes);
app.use(postRoutes);
app.use(express.static(path.join(__dirname,'..',  'Frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..','Frontend', 'dist', 'index.html'));
});
app.listen(4001,()=>{
    console.log("Server is running on port 4001")
})

