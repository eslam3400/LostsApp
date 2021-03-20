const fs = require('fs')
const path = require('path');
const express = require('express');
const sesssion = require('express-session');
const fileUpload = require('express-fileupload')
const Controller = require('./app/controller/Controller');
const Middleware = require('./app/middleware/Middelware');
const app = express()
/*
  Setup the view engine to the ejs
*/
app.set('view engine', 'ejs');
/*
  by default we can't access a file from the front end for security purposes
  so when we wanna get files to the front-end we need to make them static like that
*/
app.use(express.static(path.join(__dirname, 'public')));
/**
 * by using this i can access data from post reqest with the body object
 */
app.use(express.urlencoded());
app.use(sesssion({ secret: "ez" }))
/**
 * by using this i can upload files to the server from the files object
 */
app.use(fileUpload())

app.get('/', (req,res)=>res.send("Hello World")) //Done
app.get('/login', (req, res) => res.render('login')) //Done
app.get('/logout', Controller.User.logout) //Done
app.post('/login', Controller.User.login) //Done
app.post('/signup', Controller.User.signup) //Done
app.post('/post', Controller.User.addLostItem) //Done
app.post('/post/foundit', Controller.User.foundLostItem) //Done
app.get('/my-losts', Middleware.Auth.auth, Controller.User.trackLosts)

app.listen(process.env.PORT || 3000, () => console.log("http://localhost:3000"))
