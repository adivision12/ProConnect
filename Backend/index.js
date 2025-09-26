const express= require("express");
const app=express();
const userRoutes=require("./Routers/userRoutes.js")
const postRoutes=require("./Routers/postRoutes.js")
const mongoose = require('mongoose');
const path=require('path');
var cors = require('cors');
require('dotenv').config();
const aiRoutes = require("./Routers/aiRoutes.js");
const authRoutes = require("./Routers/authRoutes.js");
  try {
   mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
 useUnifiedTopology: true,
  tls: true,
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
app.use("/api", authRoutes);
app.use("/api/ai", aiRoutes);

const helmet = require('helmet');


// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       useDefaults: true,
//       directives: {
//         "script-src": [
//           "'self'",
//           "https://accounts.google.com",
//           "https://apis.google.com"
//         ],
//         "frame-src": [
//           "'self'",
//           "https://accounts.google.com"
//         ],
//         "connect-src": [
//           "'self'",
//           "https://ipapi.co",
//           "https://api.cloudinary.com",
//           "https://accounts.google.com",
//           "https://oauth2.googleapis.com"
//         ],
//         "img-src": [
//           "'self'",
//           "data:",
//           "https:",
//           "https://res.cloudinary.com",
//           "https://lh3.googleusercontent.com" // ✅ for Google profile pics
//         ]
//       }
//     }
//   })
// );

app.use("/api",userRoutes);
app.use(postRoutes);
app.use(express.static(path.join(__dirname,'..',  'Frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..','Frontend', 'dist', 'index.html'));
});
app.listen(4001,()=>{
    console.log("Server is running on port 4001")
})

