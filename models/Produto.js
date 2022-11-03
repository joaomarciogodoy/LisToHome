const mongooose = require('mongoose');
const Schema = mongooose.Schema;

var date = new Date();
var formatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
});

const Produto = new Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        required: true
    },
    img: {
        type: String,
        required: false,
        default: "teste.png"

    },
    date: {
        type: String,
        default: formatter.format(date)
    },
    id_user: {
        type: String,
        required: true,
        default: "teste",
      },
});

mongooose.model('produtos', Produto);



