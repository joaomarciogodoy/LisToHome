const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash')
require('./models/Lista');
const Lista = mongoose.model('listas');
require('./models/Usuario');
const Usuario = mongoose.model('usuarios');
require('./models/ListaProduto');
const ListaProduto = mongoose.model('listaprodutos');
const usuarios = require('./routes/User');
const passport = require('passport');
const {isAdmin} = require('./helpers/isAdmin');
require("./config/auth")(passport);



//Configurações
//Sessão
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


//Flash
app.use(flash());

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    // res.locals.username = req.user

    next();
}
);

//Body Parser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://joaomarcio:*Aa40028922@cluster0.mu0yood.mongodb.net/test').then(() => {
    console.log('Conectado ao MongoDB');
}
//mongodb://127.0.0.1/LisToHome
).catch((err) => {
    console.log('Erro ao conectar ao MongoDB: ' + err);
}
);


//Public
app.use(express.static(path.join(__dirname, 'public')));



//Rotas

app.get("/", (req,res)=>{
    res.render('usuarios/landing')
})





app.get("/sobre", (req,res)=>{
    res.render('usuarios/sobre')
})


app.get('/homelist',isAdmin, (req, res) => {

if(req.user.compartilhadas == "nenhuma"){
    Lista.find({id_user: req.user._id }).lean().sort({data:"asc"}).then((listas) => {
        
        res.render('index', { listas: listas});
        }).catch((err) => {
            console.log(err);
        }
        );
} else{

     Lista.find( {$or: [{nome: req.user.compartilhadas }, {id_user: req.user._id } ]}).lean().sort({data:"asc"}).then((listas) => {
        
    res.render('index', { listas: listas});
    }).catch((err) => {
        console.log(err);
    }
    )
}
}
);

// $and: [
//         {_id: req.user._id},
//         {_id: req.user.compartilhadas}
//     ]

app.get('/lista/:id', (req, res) => {
    let nomelista = req.params.id
    ListaProduto.find({lista: nomelista}).lean().then((listas) => {
        Lista.findOne({nome : nomelista}).lean().then((lista) => {
            res.render('lista', { listas: listas, lista:lista});
        }
        )
       
    }).catch((err) => {
        console.log(err);
    }
    );
}
);



app.use('/admin', adminRoutes);
app.use('/usuarios', usuarios);


//Outros
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}
);