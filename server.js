
// generic authetication server using json web tokens and sqlite


//////////////////////////////////////////////////////////////
// REQUIREMENTS
//////////////////////////////////////////////////////////////



//first check if we are on production - if not load environment variables
if (process.env.NODE_ENV !== 'production'){
    //we are in development, we want to require the development
    //dependencie of dotenv - using the env variables defined in the
    //.env file
    require('dotenv').config()
}


const express            = require('express')
const bcrypt             = require('bcrypt')
const passport           = require('passport')
const initializePassport = require('./passport-config')
const flash              = require('express-flash')
const session            = require('express-session')


//////////////////////////////////////////////////////////////
// VARIABLES
//////////////////////////////////////////////////////////////

//main app variable
const app     = express()

//own variables
const users = []

/////////////////////////////////////////////////////////////
// initiaölization
/////////////////////////////////////////////////////////////

//initialize the passport
initializePassport(
        passport, 
        email => users.find(user => user.email === email)
)

// set the view engine
app.set('view-engine', 'ejs')


// If extended is false, you can not post "nested object"
//      person[name] = 'cw'
// Nested Object = { person: { name: cw } }
//      If extended is true, you can do whatever way that you like.
// if false, we can use the forms fields inside of our post methods
// e.g. within app.post('/login'):  req.body.name or re.body.password...
app.use(express.urlencoded({ extended: false }))

//Flash Messages for the Express Application
//Flash is an extension of connect-flash with 
//the ability to define a flash message and render it without redirecting the request.
app.use(flash())

app.use(session({
    secret            : process.env.SESSION_SECRET,
    resave            : false, //we shouldn't resave our session variables 
                               //if nothing has changed
    saveUninitialized : false //don't save empty session
}))



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
app.post('/login', (req, res) => {
    res.render('register.ejs', {})
 })

// register route - POST
app.post('/register', async (req, res) => {
    try {
        //hash the password given by the user during registration
        //bycrypt is a asynchronous function, this is why we use await
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        //having now the users hashed password, we can push the full user to
        //the user array - to sqlite later on
        users.push({
            id:       Date.now().toString(),
            name:     req.body.name,
            email:    req.body.email,
            password: hashedPassword
        })
        //if successfull, redirect to the login page
        res.redirect('/login')
    } catch {
        res.redirect('register')
    }
    console.log(users)
 })






 //run the server
app.listen(3000)




