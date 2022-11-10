const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
require('../models/Lista');
const Lista = mongoose.model('listas');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');
require('../models/Produto');
const Produto = mongoose.model('produtos');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const multer  = require('multer')

// const upload = multer({ dest: 'uploads/' })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/user_img')
    },
    filename: function (req, file, cb) {
  
        cb(null,  file.originalname );
  
    }
  });
  var upload = multer({ storage: storage });
  


  






router.get('/registro', (req, res) => {
    res.render('usuarios/registrolanding');
}
);


router.post('/registro', upload.single('user_img'), (req, res, next) => {
    var erros = [];
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome inválido' });
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: 'E-mail inválido' });
    }
    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: 'Senha inválida' });
    }
    if (req.body.senha.length < 3) {
        erros.push({ texto: 'Senha muito curta' });
    }
    if (req.body.senha != req.body.senha2  ) {
        erros.push({ texto: 'As senhas não conferem' });
    }
    if (erros.length > 0) {
        res.render('usuarios/registrolanding', { erros: erros });
    } else {
        Usuario.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash('error_msg', 'Já existe um usuário com esse e-mail');
                res.redirect('/usuarios/registrolanding');
            } else {
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha, 
                    img: req.file.originalname
                }
                );
                const hash = bcrypt.hashSync(novoUsuario.senha, bcrypt.genSaltSync(10));
                novoUsuario.senha = hash;

                novoUsuario.save().then(() => {
                    req.flash('success_msg', 'Usuário cadastrado com sucesso');
                    passport.authenticate('local', {
                        successRedirect: '/',
                        failureRedirect: '/usuarios/login',
                        failureFlash: true
                    })(req, res, next);
                }
                ).catch((err) => {
                    req.flash('error_msg', 'Erro ao cadastrar usuário');
                    res.redirect('/usuarios/registrolanding');
                }
                );
            }
        }
        ).catch((err) => {
            req.flash('error_msg', 'Erro ao cadastrar usuário');
            res.redirect('/usuarios/registrolanding');
        }
        );
    }
}
);

router.get('/login', (req, res) => {
    res.render('usuarios/loginlanding');
}
);

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next);
}
);

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            req.flash('error_msg', 'Erro ao deslogar');
            res.redirect('/');
        } else {

    req.flash('success_msg', 'Deslogado com sucesso');
    res.redirect('/');
        }

}
);
}
);



router.get('/compartilhar/:nome_lista', (req, res) => {
    Usuario.find({ _id: {$ne: req.user._id} }).lean().then((usuarios) => {
       
        const nomeDaLista = req.params.nome_lista;
        res.render('usuarios/compartilhar', {usuarios:usuarios, nome_lista:nomeDaLista});
    })
  
}
);

router.post('/pesquisar', (req, res) => {
    Usuario.find({ nome:  { $regex: '.*' + req.body.pesquisa + '.*' }, _id: {$ne: req.user._id} }).limit(1).lean().then((usuarios) => {
        const nomeDaLista = req.body.nome_lista;
        res.render('usuarios/compartilhar', {usuarios:usuarios, nome_lista:nomeDaLista});
    })
  
}
);






router.post('/compartilhar/salvar', (req, res) => {
    Usuario.findOneAndUpdate({_id: req.body.verificadorId},{ $addToSet: {compartilhadas:req.body.nome_lista}}).lean().then(() => {
        req.flash('success_msg', 'Lista compartilhada com sucesso');
        res.redirect('/homelist')
    })
  
}
);




module.exports = router;