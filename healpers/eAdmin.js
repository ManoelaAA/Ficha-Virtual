module.exports = {
    eAdmin: function(req, res, next) {

        if (req.isAuthenticated()){
            return next()
        } else {
            req.flash('error_msg', "Você não tem autorização para acessar este recurso")
            res.redirect("/adm/login")
        }

    }
}
