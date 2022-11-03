const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    img:{
        type: String,
        required: false,
        default:"teste"
    },
    isAdmin: {
        type: Number,
        default: 0
    },
    compartilhadas:{
        type: [String],
     
    }
}
);

mongoose.model('usuarios', Usuario);