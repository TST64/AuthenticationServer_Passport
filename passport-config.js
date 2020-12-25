//passport initialization

const LocalStrategy = require('passport-local').Strategy
const bcrypt        = require('bcrypt')


function initialized(passport, getUserByEmail, getUserById) {

    const authenticateUser = async (email, password, done) => {
        //function returning the user identified by the email
        const user = getUserByEmail(email)

        //check if the user exists
        if (user == null) {
            //if user doesn't exists perform done function
            return done(null, false, { message: 'No user with this email'})
        }

        //user exists - check password
        try {
            if (await bcrypt.compare(password, user.password)) {
                //password ok - return user
                return done(null, user)
            } else
            {
                //password incorrect - return error message
                return done(null, false, { message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }



    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
  }

module.exports = initialized