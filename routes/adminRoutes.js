const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Lista');
const Lista = mongoose.model('listas');
require('../models/ListaProduto');
const ListaProduto = mongoose.model('listaprodutos');
require('../models/Produto');
const Produto = mongoose.model('produtos');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');
const {isAdmin} = require('../helpers/isAdmin');


router.get('/listas', (req, res) => {
    Lista.find({ id_user: req.user._id }).lean().sort({ date: 'desc' }).then((listas) => {
        res.render('admin/listas', { listas: listas });
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as listas');
    }
    );
}
);


router.get('/listas/add', (req, res) => {
    res.render('admin/addlistas');
}
);

router.post('/listas/nova', (req, res) => {

    var erros = [];
    if (!req.body.nome || req.body.nome == '' || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome inválido.' });
    }


    if (req.body.nome.length < 3) {
        erros.push({ texto: 'Nome muito pequeno.' });
    }


    if (erros.length > 0) {
        res.render('admin/addlistas', { erros: erros });
    } else {
        const novaLista = {
            nome: req.body.nome,
            id_user: req.user._id
        }
        new Lista(novaLista).save()

            .then(() => {
                req.flash('success_msg', 'Lista criada com sucesso.');
                res.redirect('/homelist');
            }
            ).catch((erro) => {
                req.flash('error_msg', 'Erro ao criar a lista.');
                res.redirect('/admin/listas');
                console.log(erro);
            }
            );
    }


}
);


router.get('/listas/edit/:id', (req, res) => {

    Lista.findOne({ _id: req.params.id }).lean().then((lista) => {
        res.render('admin/editlistas', { lista: lista });
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar a lista.');
        res.redirect('/admin/listas');
    }
    );
})

router.post('/listas/edit', (req, res) => {
    Lista.findOne({ _id: req.body.id }).then((lista) => {
        lista.nome = req.body.nome;
        lista.save()
            .then(() => {
                req.flash('success_msg', 'Lista editada com sucesso.');
                res.redirect('/admin/listas');
            }
            ).catch((erro) => {
                req.flash('error_msg', 'Erro ao editar a lista.');
                res.redirect('/admin/listas');
            }
            );
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar a lista.');
        res.redirect('/admin/listas');
    }
    );
}
);

router.post('/listas/delete', (req, res) => {
    Lista.deleteOne({ _id: req.body.id }).lean().then(() => {
        req.flash('success_msg', 'Lista removida com sucesso.');
        res.redirect('/admin/listas');
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao remover a lista.');
        res.redirect('/admin/listas');
    }
    );
}
);



//ROTAS DE PRODUTOS GERAIS
router.get('/produtos', (req, res) => {
    Produto.find({id_user: req.user._id}).lean().populate("categoria").sort({ date: 'desc' }).then((produtos) => {
        res.render('admin/produtos', { produtos: produtos });


    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os produtos');
    }
    );
}
);


router.get('/produtos/add', (req, res) => {
    Categoria.find({id_user: req.user._id}).lean().then((categorias) => {
    res.render('admin/addprodutos', { categorias: categorias });
}
).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao carregar as categorias');
    res.redirect('/admin/produtos');
}

);
}
);


router.post('/produtos/nova', (req, res) => {

    var erros = [];
    if (!req.body.nome || req.body.nome == '' || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: 'Nome inválido.' });
    }


    if (req.body.nome.length < 3) {
        erros.push({ texto: 'Nome muito pequeno.' });
    }


    if (erros.length > 0) {
        res.render('admin/addprodutos', { erros: erros });
    } else {

// let img = ''

// switch (req.body.categoria) {
//     case 'Alimentos': 
//         img = 'Alimentos.jpg'
//         break;
//     case "62e3e5255a023b153decb350":
//         img = 'Bebidas.jpg'
//         break;
//     case 'Congelados':
//         img = 'Congelados.jpg'
//         break;    
//     case 'Higiene_Pessoal':
//         img = 'Higiene_Pessoal.jpg'
//         break;
//     case 'Hortifruti':
//         img = 'Hortifruti.jpg'
//         break;
//     case 'Limpeza':
//         img = 'Limpeza.jpg'
//         break;
//     case 'Padaria':
//         img = 'Padaria.jpg'
//         break;
//     case 'Papelaria':
//         img = 'Papelaria.jpg'


//     default:
//         break;
// }

var formatterCurrency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  
var precoFormatado = formatterCurrency.format(req.body.preco)


var formatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
});
if(req.body.validade != ""){
   var validade = new Date(req.body.validade)
    var validadeProduto = formatter.format(validade)
}

let produtoNome = req.body.nome

        const novoProduto = {
            nome: produtoNome,
            preco: precoFormatado,
            categoria: req.body.categoria,
            id_user:req.user._id,
            validade: validadeProduto
            // img: img
        }
        new Produto(novoProduto).save()

            .then(() => {
                req.flash('success_msg', `Produto "${produtoNome}" criado com sucesso.`);
                res.redirect('back');
            }
            ).catch((erro) => {
                req.flash('error_msg', 'Erro ao criar o produto.');
                console.log(erro);
                res.redirect('/admin/produtos');
            }
            );
    }


}
);

router.get('/produtos/edit/:id', (req, res) => {

    Produto.findOne({ _id: req.params.id }).lean().then((produto) => {
       Categoria.find({id_user: req.user._id}).lean().then((categoria)=>{
        res.render('admin/editprodutos', { produto: produto, categoria:categoria });
       })
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar o produto.');
        res.redirect('/admin/produtos');
    }
    );
}
);


router.post('/produtos/edit', (req, res) => {
    Produto.findOne({ _id: req.body.id }).then((produto) => {
        produto.nome = req.body.nome;
        produto.categoria = req.body.categoria;
        produto.preco = req.body.preco;
        produto.save()
            .then(() => {
                req.flash('success_msg', 'Produto editado com sucesso.');
                res.redirect('/admin/produtos');
            }
            ).catch((erro) => {
                req.flash('error_msg', 'Erro ao editar produto.');
                console.log(erro);
                res.redirect('/admin/produtos');
            }
            );
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar o produto.');
        console.log(err);
        res.redirect('/admin/produtos');
    }
    );
}
);


router.get('/produtos/delete/:id', (req, res) => {
    Produto.deleteOne({ _id: req.params.id }).lean().then(() => {
        ListaProduto.deleteMany({ nome: req.params.id }).lean().then(() => {
            req.flash('success_msg', 'Produto removido com sucesso.');
            res.redirect('/admin/produtos');
        }
        ).catch((erro) => {
            req.flash('error_msg', 'Erro ao remover o produto.');
            console.log(erro);
            res.redirect('/admin/produtos');
        }
        );
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao remover o produto.');
        console.log(err);
        res.redirect('/admin/produtos');
    }
    );
}
);









//ROTAS DE PRODUTOS POR LISTA
router.get('/listaprodutos', (req, res) => {
    Lista.find().lean().then((lista) => {
        res.render('admin/listaprodutos', { lista: lista });
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar as listas');
        res.redirect('/admin/listaprodutos');
    }
    );
}
);

router.get('/listaprodutos/add/:nomelista', (req, res) => {

//     Produto.find({}).populate("categoria").lean().then((produtos) => {
//         Lista.findOne({ _id: req.params.listid }).lean().then((lista) => {

//             Categoria.find({}).lean().then((categorias) => {
//                 res.render('admin/addlistaprodutos', { produtos: produtos, lista: lista, categorias: categorias, listid: req.params.listid });
//             }
//             ).catch((err) => {
//                 req.flash('error_msg', 'Houve um erro ao carregar as categorias');
//                 res.redirect('/admin/listaprodutos');
//             }
//             );
//         }
//         ).catch((err) => {
//             req.flash('error_msg', 'Houve um erro ao carregar a lista');
//             res.redirect('/admin/listaprodutos');
//         }
//         );
//     }
//     ).catch((err) => {
//         req.flash('error_msg', 'Houve um erro ao carregar os produtos');
//         res.redirect('/admin/listaprodutos');
//     }
//     );

    Produto.find({id_user: req.user._id}).lean().populate("categoria").then((produtos) => {

       Categoria.find({id_user: req.user._id}).lean().then((categorias)=>{
        let nomelista = req.params.nomelista
        res.render('admin/addlistaprodutos', { produtos: produtos, categorias:categorias, nomelista:nomelista});
       })
        }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar os produtos');
        res.redirect('/admin/listaprodutos');
    }
    );
}
);



router.post('/listaprodutos/nova/:id/:idcategoria', (req, res) => {
Produto.findOne({ _id: req.params.id }).lean().then((produto) => {
   Categoria.findOne({_id: req.params.idcategoria}).lean().then((categoria) => {
         Lista.find({id_user: req.user._id}).lean().then((listas) => {
            res.render('admin/verificaproduto', { produto: produto, categoria: categoria, listas: listas });
         })
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar as categorias');
        res.redirect('/admin/listaprodutos');
    }
    );
}
).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao carregar o produto');
    res.redirect('/admin/listaprodutos');
}
);
}
);





router.post('/listaprodutos/nova', (req, res) => {
    var erros = [];
    if (req.body.lista == '0') {
        erros.push({ texto: 'Categoria inválida.' });
    }
    if (erros.length > 0) {
        res.render('admin/addlistaprodutos', { erros: erros });
    } else {
        let nomeLista= req.body.lista
        const novoListaProduto = {
            nome: req.body.nome,
            preco: req.body.preco,
            categoria: req.body.categoria,
            lista: nomeLista,
            id_user: req.user._id,
            validade: req.body.validade
        }
        new ListaProduto(novoListaProduto).save()

            .then(() => {
                let nomeflashmsg = novoListaProduto.lista
                req.flash('success_msg', `Produto adicionado na lista ${nomeflashmsg}`);
                res.redirect(`back`)
            }
            ).catch((erro) => {
                req.flash('error_msg', 'Erro ao criar o produto.');
                console.log(erro);
                res.redirect('/admin/listaprodutos');
            }
            );
    }
}
);


router.get('/listaprodutos/edit/:id', (req, res) => {

    ListaProduto.findOne({ _id: req.params.id }).lean().then((listaproduto) => {
                res.render('admin/editlistaprodutos', { listaproduto: listaproduto,});

            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao listar os produtos');
            }
            );

        })

router.post('/listaprodutos/edit', (req, res) => {
    ListaProduto.findOne({ _id: req.body.id }).then((listaproduto) => {
        let lista= req.body.lista
        listaproduto.nome = req.body.nome_produto;
        listaproduto.categoria = req.body.categoria;
        listaproduto.preco = req.body.preco;
       listaproduto.lista = lista
        listaproduto.save()
            .then(() => {
                req.flash('success_msg', 'Produto editado com sucesso.');
                res.redirect(`/lista/${lista}`);
            }
            ).catch((erro) => {
                req.flash('error_msg', 'Erro ao editar produto.');
                console.log(erro);
                res.redirect('/admin/listaprodutos');
            }
            );
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao editar o produto.');
        console.log(err);
        res.redirect('/admin/listaprodutos');
    }
    );
}
);

router.get('/listaprodutos/delete/:id', (req, res) => {
    ListaProduto.deleteOne({ _id: req.params.id }).lean().then(() => {
        req.flash('success_msg', 'Produto removido com sucesso.');
        res.redirect('back');
    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao remover o produto.');
        console.log(err);
        res.redirect('/admin/listaprodutos');
    }
    );
}
);




//Cadastrando Categorias 
router.get('/categorias', (req, res) => {
    Categoria.find( {id_user: req.user._id}).lean().then((categorias) => {
        res.render('admin/categorias', { categorias: categorias });

    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias');
        console.log(err);
    }
    );
}
);

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias');
}
);

router.post('/categoria/nova', (req, res) => {
    var erros = [];
    if (req.body.nome == '') {
        erros.push({ texto: 'Nome inválido.' });
    }
    if (erros.length > 0) {
        res.render('admin/addcategorias', { erros: erros });
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            id_user: req.user._id
        }
        new Categoria(novaCategoria).save()

            .then(() => {
                req.flash('success_msg', 'Categoria criada com sucesso.');
                res.redirect('/admin/categorias');
            }
            ).catch((erro) => {
                req.flash('error_msg', 'Erro ao criar a categoria.');
                console.log(erro);
                res.redirect('/admin/categorias');
            }
            );
    }
}
);


router.post('/categoria/nova/modal', (req, res) => {
   
        const novaCategoria = {
            nome: req.body.categoria,
            id_user: req.user._id
        }
        new Categoria(novaCategoria).save()

            .then(() => {
                req.flash('success_msg', 'Categoria criada com sucesso.');
                res.redirect('back');
            }
            ).catch((erro) => {
                req.flash('error_msg', 'Erro ao criar a categoria.');
                console.log(erro);
                res.redirect('/admin/categorias');
            }
            );
    }

);


router.get('/categoria/edit/:id', (req, res) => {

    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render('admin/editcategorias', { categoria: categoria });

    }
    ).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao carregar a categoria.');
        console.log(err);
    }
    );
}
);

        router.post('/categoria/edit', (req, res) => {
            Categoria.findOne({ _id: req.body.id }).then((categoria) => {
                categoria.nome = req.body.nome;
                categoria.save()
                    .then(() => {
                        req.flash('success_msg', 'Categoria editada com sucesso.');
                        res.redirect('/admin/categorias');
                    }
                    ).catch((erro) => {
                        req.flash('error_msg', 'Erro ao editar categoria.');
                        console.log(erro);
                        res.redirect('/admin/categorias');
                    }
                    );
            }
            ).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao editar a categoria.');
                console.log(err);
                res.redirect('/admin/categorias');
            }
            );
        }
        );


        router.post('/categoria/delete', (req, res) => {
            Categoria.deleteOne({ _id: req.body.id }).lean().then(() => {
                req.flash('success_msg', 'Lista removida com sucesso.');
                res.redirect('/admin/categorias');
            }
            ).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao remover a lista.');
                res.redirect('/admin/categorias');
            }
            );
        }
        );

        //filtrar produtos por categoria
        router.get('/filter', (req, res) => {
            Categoria.find({id_user: req.user._id}).lean().then((categorias) => {
                const categoria = req.query.categoriafilter;
               if(categoria == 0){
                Produto.find({id_user: req.user._id}).lean().then((produtos) => {
                    res.render('admin/addlistaprodutos', { produtos: produtos, categorias: categorias });
                }
                ).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao listar os produtos');
                    console.log(err);
                }
                );

               } else {
                Produto.find({categoria:categoria,id_user: req.user._id}).lean().populate('categoria').then((produtos) => {
                    res.render('admin/addlistaprodutos', { categorias: categorias, produtos: produtos });
                }
                ).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao listar os produtos.');
                    console.log(err);
                }
                );
               }

            }
            ).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao listar as categorias');
                console.log(err);
            }
            );
        }
        );
 

















module.exports = router;