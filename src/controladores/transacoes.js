const knex = require('../conexao');
const { schemaCadastroTransacao } = require('../funcoes_verificacao/verificar_requisicao_body');

const listarTransacoes = async (req, res) => {
    const { usuario } = req;
    const { filtro } = req.query;

    try {
        let transacoesSelecionadas = [];

        const transacoes = await knex('transacoes')
            .where({ usuario_id: usuario.id });

        for (const transacao of transacoes) {
            const nomeCategoria = await knex('categorias')
                .where({ id: transacao.categoria_id });

            transacao.categoria_nome = nomeCategoria[0].nome;
        }

        if (filtro) {
            if (filtro.length > 1) {
                for (const f of filtro) {
                    const filtroTransacao = transacoes.filter(transacao => {
                        return f === transacao.categoria_nome
                    });
                    transacoesSelecionadas.push(...filtroTransacao)
                }
                return res.status(200).json(transacoesSelecionadas);
            }

            if (filtro.length === 1) {
                const filtroTransacao = transacoes.filter(transacao => {
                    return transacao.categoria_nome === filtro[0];
                });
                return res.status(200).json(...filtroTransacao);
            }
        }

        return res.status(200).json(transacoes);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const detalharTransacao = async (req, res) => {
    const { id: idTransacao } = req.params;
    const { usuario } = req;

    try {
        const transacao = await knex('transacoes')
            .where({ id: idTransacao })
            .first('*');

        if (!transacao) {
            return res.status(404).json({ mensagem: "Transação inexistente." });
        }

        if (transacao.usuario_id !== usuario.id) {
            return res.status(404).json({ mensagem: "Transação inexistente." });
        }

        const nomeCategoria = await knex('categorias')
            .where({ id: transacao.categoria_id }).first('*');

        transacao.categoria_nome = nomeCategoria.nome;

        return res.status(200).json(transacao);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    const { usuario } = req;

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: "O tipo de transação especificado é inválido." });
    }

    try {

        await schemaCadastroTransacao.validate(req.body);

        const categoriaEncontrada = await knex('categorias')
            .where({ id: categoria_id }).first('*');

        if (!categoriaEncontrada) {
            return res.status(400).json({ mensagem: "Não existe categoria para o Id informado." });
        }

        const cadastroTransacao = await knex('transacoes').insert({
            descricao,
            valor,
            data,
            categoria_id,
            usuario_id: usuario.id,
            tipo
        }).returning('*');

        if (!cadastroTransacao) {
            return res.status(400).json({ mensagem: "Não foi possível cadastrar a transação." });
        }

        return res.status(200).json({
            id: cadastroTransacao[0].id,
            tipo,
            descricao,
            valor,
            data,
            usuario_id: usuario.id,
            categoria_id,
            categoria_nome: categoriaEncontrada.nome,
        });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarTransacao = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body;
    const { usuario } = req;
    const { id: idTransacao } = req.params;

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ mensagem: "O tipo de transação especificado é inválido." });
    }

    try {

        const transacaoEncontrada = await knex('transacoes')
            .where({ id: idTransacao }).first("*");

        if (!transacaoEncontrada) {
            return res.status(404).json({ mensagem: "transação inexistente." });
        }

        if (transacaoEncontrada.usuario_id !== usuario.id) {
            return res.status(404).json({ mensagem: "Você só pode atualizar suas próprias transações." });
        }

        const existeCategoria = await knex('categorias')
            .where({ id: categoria_id }).first('*');

        if (!existeCategoria) {
            return res.status(404).json({ mensagem: "Categoria da transação inexistente." });
        }

        const novosDadosTransacao = {
            descricao: !descricao ? transacaoEncontrada.descricao : descricao,
            valor: !valor ? transacaoEncontrada.valor : valor,
            data: !data ? transacaoEncontrada.data : data,
            categoria_id: !categoria_id ? transacaoEncontrada.categoria_id : categoria_id,
            tipo: !tipo ? transacaoEncontrada.tipo : tipo
        }

        const atualizarTransacao = await knex('transacoes')
            .update(novosDadosTransacao)
            .where({ id: idTransacao }).returning('*');

        if (!atualizarTransacao) {
            return res.status(400).json({ mensagem: "Não foi possível atualizar a transação." });
        }

        return res.status(200).json({ mensagem: "Informações atualizadas com sucesso."});

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirTransacao = async (req, res) => {
    const { id: idTransacao } = req.params;
    const { usuario } = req;

    try {

        const encontrarTransacao = await knex('transacoes')
            .where({ id: idTransacao })
            .first('*');

        if (!encontrarTransacao) {
            return res.status(404).json({ mensagem: "transação inexistente." });
        }

        if (encontrarTransacao.usuario_id !== usuario.id) {
            return res.status(404).json({ mensagem: "transação inexistente." });
        }

        const transacaoExcluida = await knex('transacoes')
            .where({ id: idTransacao })
            .del();

        if (!transacaoExcluida) {
            return res.status(400).json({ mensagem: "A transação não foi excluido" });
        }

        return res.status(200).json({ mensagem: "Transação excluida com sucesso." });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterExtrato = async (req, res) => {
    const { usuario } = req;

    try {
        const transacoes = await knex('transacoes')
            .where({ usuario_id: usuario.id }).returning('*');

        if (!transacoes) {
            return res.status(200).json({ mensagem: "Não existem transacoes." });
        }

        let saida = 0;
        for (const transacao of transacoes) {
            if (transacao.tipo === 'saida') {
                saida += transacao.valor;
            }
        }

        let entrada = 0;
        for (const transacao of transacoes) {
            if (transacao.tipo === 'entrada') {
                entrada += transacao.valor;
            }
        }

        const extrato = {
            entrada,
            saida,
            saldo: entrada - saida
        }

        return res.status(200).json(extrato);

    } catch (error) {
        return res.status(400).json(error.message);
    }

}

module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato
}