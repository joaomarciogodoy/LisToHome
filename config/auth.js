const localStrategy  = require ("passport-local").Strategy
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

module.exports = function(passport) {
    passport.use(new localStrategy({ usernameField: 'email', passwordField:'senha' }, (email, senha, done) => {
        Usuario.findOne({ email: email }).then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: 'E-mail não cadastrado' });
            }
            if (!bcrypt.compareSync(senha, usuario.senha)) {
                return done(null, false, { message: 'Senha incorreta' });
            }
            return done(null, usuario);
        }).catch((err) => {
            return done(null, false, { message: 'Erro ao autenticar usuário' });
        }
        );
    }
    ));
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    }
    );
    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario);
        }
        );
    }
    );
}