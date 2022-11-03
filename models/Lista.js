const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var date = new Date();
var formatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
});

const Lista = new Schema({
  nome: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: formatter.format(date),
  },
  id_user: {
    type: String,
    required: true,
    default: "teste",
  },
});

mongoose.model("listas", Lista);
