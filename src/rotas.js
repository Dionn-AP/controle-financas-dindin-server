const express = require('express');

const categorias = require('./controladores/categorias');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const validarLogin = require('./intermediarios/validacao_usuario');
const transacoes = require('./controladores/transacoes');

const rota = express();

//ROTAS USUARIOS
rota.post('/usuario', usuarios.cadastrarUsuario);
rota.post('/login', login.login);

//AS ROTAS A PARTIR DESSE PONTO SERÃO VALIDADAS PELO MIDDLEWARE
rota.use(validarLogin);

rota.get('/usuario', usuarios.listarPerfilUsuarios);
rota.put('/usuario/', usuarios.atualizarUsuario);


//ROTAS TRANSAÇÕES
rota.get('/transacao/extrato', transacoes.obterExtrato);
rota.get('/transacao', transacoes.listarTransacoes);
rota.get('/transacao/:id', transacoes.detalharTransacao);
rota.post('/transacao', transacoes.cadastrarTransacao);
rota.put('/transacao/:id', transacoes.atualizarTransacao);
rota.delete('/transacao/:id', transacoes.excluirTransacao);


//ROTAS CATEGORIA
rota.get('/categoria', categorias.listarCategoria);
rota.post('/categoria', categorias.adicionarCategoria);
rota.delete('/categoria/:id', categorias.deletarCategoria);

module.exports = rota;