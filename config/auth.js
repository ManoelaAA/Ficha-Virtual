const localStrategy = require("passport-local").Strategy
const firebase = require("firebase/app")
var database = require('firebase/database')
const bcrypt = require("bcryptjs")

firebase.app()  
var db = firebase.database()

module.exports = function (passport){

    passport.use(new localStrategy({usernameField: "nome", passwordField: "senha"}, (username, password, done) => {

        db.ref('log adm').once('value').then((snapshot) => {
            var adm = snapshot.val()

            bcrypt.compare(password, adm.password, (erro, batem) => {

                if(adm.password == password && adm.username == username) {
                    return done(null, adm)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })

        })

    }))

    passport.serializeUser((user, done) => {    
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        db.ref('log adm').once('value').then((snapshot) => {
            var adm = snapshot.val()
            done(null, user)
        })
    })

}
