const express = require("express")
const router = express.Router()
const firebase = require("firebase/app")
var database = require('firebase/database')
var authenticate = require('firebase/auth')
var path = require('path');
var firebaseConfig = {
    apiKey: "AIzaSyCO6-LV-_CYfLDFU7pAmGkF6kGVGc9QhGg",
    authDomain: "fichavirtualgesf.firebaseapp.com",
    databaseURL: "https://fichavirtualgesf-default-rtdb.firebaseio.com",
    projectId: "fichavirtualgesf",
    storageBucket: "fichavirtualgesf.appspot.com",
    messagingSenderId: "686082842306",
    appId: "1:686082842306:web:76cdbf302c48bcdb38e55b",
    measurementId: "G-ZH3HNTWESW"
};
const passport = require('passport');

const {eAdmin} = require('../helpers/eAdmin')

firebase.initializeApp(firebaseConfig);

var db = firebase.database()
var auth = firebase.auth()


router.get('/', eAdmin, (req, res) => {
        console.log("a")
        res.render('admin/index')
})




router.get('/login', (req, res) => {
    res.render("admin/login")
})

router.post('/login', (req, res, next) => {
    console.log('req: ', req.body)
    auth.signInWithEmailAndPassword(req.body.nome, req.body.senha).then(() => {
        passport.authenticate("local", {
            successRedirect: "/adm",
            failureRedirect: "/adm/login",
            failureFlash: true
        })(req, res, next)
    }).catch((err) => {
        if(err.code === 'auth/invalid-email'){
            req.flash('error_msg', 'E-mail inválido')
        } else if(err.code == "auth/invalid-password"){
            req.flash('error_msg', 'Senha incorreta')
        } else{
            req.flash('error_msg', `Ocorreu um erro: \n\n${err.message}\nCódigo de erro: ${err.code}`)
        }
    })
})




router.get('/users', eAdmin, (req, res) => {
    db.ref('usuarios').once('value').then((snapshot) => {
        const users = snapshot.val()
        res.render("admin/users", {usuarios: users})
    })
})

router.get('/users/edit/:matricula', eAdmin, (req, res) => {
        db.ref('usuarios/' + req.params.matricula).once('value').then((snapshot) => {
            const usuario = snapshot.val()
            res.render("admin/editusers", {user: usuario})
        })
})

router.get('/users/saveedit/:matricula/:senha/:saldo', eAdmin, (req, res) => {
        db.ref('usuarios/' + req.params.matricula).update({
            "senha": req.params.senha,
            "saldo": req.params.saldo
        })
        res.redirect("/adm/users")
})

router.get('/users/delete/:matricula', eAdmin, (req, res) => {
        db.ref('usuarios/' + req.params.matricula).remove()
        res.redirect("/adm/users")
})

router.get('/users/add/:matricula/:valor', eAdmin, (req, res) => {
    db.ref('usuarios/' + req.params.matricula).once('value').then((snapshot) => {
        var user = snapshot.val()
        var valor = parseFloat(req.params.valor)
        console.log(user.saldo)
        db.ref('usuarios/' + req.params.matricula).update({ "saldo": user.saldo + valor})
        res.redirect("/adm/users")
    })
})

router.get('/estoque', eAdmin, (req, res) => {
    db.ref('estoque').once('value').then((snapshot) => {
        const estoque = snapshot.val()
        res.render("admin/estoque", {produtos: estoque})
    })
})

router.get('/estoque/save/:produto/:qnt', eAdmin, (req, res) => {
    db.ref('estoque/' + req.params.produto).update({
        "quantidade": parseInt(req.params.qnt)
    })
    res.redirect('/adm/estoque')
})

router.get('/almoco', eAdmin, (req, res) => {
    db.ref('usuarios').once('value').then((snapshot) => {
        const users = snapshot.val()
        res.render("admin/almoco", {usuarios: users})
    })
})

router.get('/almoco/cobrar/:matricula/:valor', eAdmin, (req, res) => {
    db.ref('usuarios/' + req.params.matricula).once('value').then((snapshot) => {
        var user = snapshot.val()
        var valor = parseFloat(req.params.valor)
        console.log(user.saldo)
        db.ref('usuarios/' + req.params.matricula).update({ "saldo": user.saldo - valor})
        res.redirect("/adm/almoco")
    })
})

router.get('/pedidos', eAdmin, (req, res) => {
        db.ref('pedidos').once('value').then((snapshot) => {
            const pedidos = snapshot.val()
            res.render("admin/pedidos", {Pedidos: pedidos})
        })
})

router.get('/pedidos/entregar/:numpedido', eAdmin, (req, res) => {
        db.ref('pedidos/' + req.params.numpedido).once('value').then((snapshot) => {
            const pedido = snapshot.val()
            db.ref('entregues/' + req.params.numpedido).update(pedido).catch((err) => {console.log(err)})
            db.ref('pedidos/' + req.params.numpedido).remove().catch((err) => {console.log(err)})
            db.ref(`usuarios/${pedido['Matrícula']}/pedido/${pedido.numpedido}`).remove().catch((err) => {console.log(err)})
            db.ref(`usuarios/${pedido['Matrícula']}/historico/${pedido.numpedido}`).update(pedido).catch((err) => {console.log(err)})
        })
        res.redirect("/adm/pedidos")
})

module.exports = router
