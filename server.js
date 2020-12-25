
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
const methodOverride     = require('method-override')


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
        // getUserByEmail function
        email => users.find(user => user.email === email),
        // // getUserById function
        id    => users.find(user => user.id === id)
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

//use and initialze passport - setting up some basics for us
app.use(passport.initialize())
//use passport: store our varaibles as persisted acroos the entire session a user has
app.use(passport.session())

//Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
app.use(methodOverride('_method'))



//rotes --------------------------------------------------------------------
//// xxx route
//app.get('/xxx', (req, res) => {
//    res.render('xxx.ejs', {})
//})

// main route
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})



// LOGIN ////////////////////////////////////////////////////////////////
app.get('/login', checkNotAuthenticated, (req, res) => {
   res.render('login.ejs', {})
})

// login route - POST
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    //redirect if successfull
    successRedirect: '/',
    failureRedirect: '/login', 
    failureFlash   : true
})
)



// LOGOUT ////////////////////////////////////////////////////////////////
app.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect('/login')
 })



// REGISTER ////////////////////////////////////////////////////////////////
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', {})
 })

// register route - POST
app.post('/register', checkNotAuthenticated, async (req, res) => {
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



 /////////////////////////////////////////////////////////////////////////////
 // MIDDLEWARE
 /////////////////////////////////////////////////////////////////////////////


 //check if user is authenticated - if not redirect to login page
 function checkAuthenticated(req, res, next) {
     // check if someone is authentiacted (logged in)
     if (req.isAuthenticated()) {
         //yes, continue with the next function
         return next()
     }

     //no - redirect to the login page
     return res.redirect('/login')
 }

 //check if user is authenticated - if not redirect to login page
 //is is necessary to check if user wants to go to the login page
 function checkNotAuthenticated(req, res, next) {
    // check if someone is authentiacted (logged in)
    if (req.isAuthenticated()) {
        //yes, redirect to the main page '/'
        return res.redirect('/')
    }

    //no - continue
    return next()
 }


 //run the server
app.listen(3000)




