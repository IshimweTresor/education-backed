const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => 
        console.log("Server is running on port 5000"));
    
}).catch(err => console.log(err));

