const express = require('express');

const categorias = require('./controladores/categorias');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const validarLogin = require('./intermediarios/validacao_usuario');
const { listarTransacoes, cadastrarTransacao, detalharTransacao, atualizarTransacao, obterExtrato, excluirTransacao } = require('./controladores/transacoes');
const relatorios = require('./utils/pdf_report');

const rota = express();

//ROTAS USUARIOS
rota.post('/usuario', usuarios.cadastrarUsuario);
rota.post('/login', login.login);

//AS ROTAS A PARTIR DESSE PONTO SERÃO VALIDADAS PELO MIDDLEWARE
rota.use(validarLogin);

rota.get('/usuario', usuarios.listarPerfilUsuarios);
rota.put('/usuario', usuarios.atualizarUsuario);


//ROTAS TRANSAÇÕES
rota.get('/transacao/extrato', async (req, res) => {
    const { usuario } = req;

    try {
        const extrato = await obterExtrato(usuario);
        return res.status(200).json(extrato);
    } catch (error) {
        console.error(error); // Log do erro para diagnóstico
        res.status(500).send('Erro ao obter extrato');
    }
});

rota.get('/transacao', async (req, res) => {
    const { usuario } = req;

    try {
        const transacoes = await listarTransacoes(usuario, req);
        return res.status(200).json(transacoes);
    } catch (error) {
        console.error(error); // Log do erro para diagnóstico
        res.status(500).send('Erro ao listar transações');
    }
});

rota.get('/transacao/:id', detalharTransacao);
rota.post('/transacao', cadastrarTransacao);
rota.put('/transacao/:id', atualizarTransacao);
rota.delete('/transacao/:id', excluirTransacao);


//ROTAS CATEGORIA
rota.get('/categoria', categorias.listarCategoria);
rota.post('/categoria', categorias.adicionarCategoria);
rota.delete('/categoria/:id', categorias.deletarCategoria);

//ROTA DE RELATÓRIO
rota.get('/relatorio', relatorios.geradorDePdf);

module.exports = rota;