
// generic authetication server using json web tokens and sqlite


const express = require('express')
const app     = express()



// set the view engine
app.set('view-engine', 'ejs')





//rotes --------------------------------------------------------------------
//// xxx route
//app.get('/xxx', (req, res) => {
//    res.render('xxx.ejs', {})
//})

// main route
app.get('/', (re, res) => {
    res.render('index.ejs', { name: 'TST' })
})

// login route
app.get('/login', (req, res) => {
   res.render('login.ejs', {})
})

// register route
app.get('/register', (req, res) => {
    res.render('register.ejs', {})
 })

// register route - POST
app.post('/register', (req, res) => {
    res.render('register.ejs', {})
 })






 //run the server
app.listen(3000)




