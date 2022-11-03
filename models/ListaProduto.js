const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var date = new Date();
var formatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
});

const ListaProduto = new Schema({
    lista: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        required: true
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
}
);

mongoose.model('listaprodutos', ListaProduto);