// Modules
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const admin = require("./routes/admin")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
var firebase = require("firebase/app");
var db = require('firebase/database')
const passport = require('passport');
require("./config/auth")(passport)

// Config
    // Session
        app.use(session({
            secret: "zap",
            resave: true,
            saveUninitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    
    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            next()
        })

    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    // Handlebars
    app.set('view engine', 'handlebars')
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))

{/* -------------------------------------------------------------------------------------------------------------------------------------- */}


// Public
    app.use(express.static(path.join(__dirname, "public")))

// Route
    app.use('/adm', admin)
    
// Anyway
    const PORT = process.env.PORT || 27
    app.listen(PORT, () => {
        console.log("Rodando server")
    })