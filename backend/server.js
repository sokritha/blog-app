require('dotenv').config({path: '.env'});

const mongoose = require('mongoose');
const http = require('http');
const app = require('./app');

// connect to mongodb 
mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log('server is connecting to database successfully')
}).catch(err=>{
    console.log('Database error: ', err)
})

const PORT = process.env.PORT || 6000;
const server = http.createServer(app);
server.listen(PORT, ()=>{
    console.log('server is running on port: ', PORT)
});