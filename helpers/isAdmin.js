module.exports = {
    isAdmin: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Você precisa estar logado para acessar essa página!');
        res.redirect('/');
    }
}