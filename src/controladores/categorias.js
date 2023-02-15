const knex = require('../conexao');

const listarCategoria = async (req, res) => {

    try {
        const categorias = await knex('categorias').returning("*");

        return res.status(200).json(categorias);

    } catch (error) {
        return res.status(500).json({
            "mensagem": "Falha na consulta. Não foi possivel listar as categorias."
        });
    }
};

const adicionarCategoria = async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome && descricao) {
        return res.status(400).json({
            mensagem: "Você precisa informar o nome da categoria"
        });
    }

    if (nome && !descricao) {
        return res.status(400).json({
            mensagem: "Você precisa informar uma descrição para a categoria"
        });
    }

    if (!nome || !descricao) {
        return res.status(400).json({
            mensagem: "Você precisa informar os dados obrigatórios"
        });
    }

    if (typeof nome != 'string') {
        return res.status(400).json({ mensagem: "O nome da categoria não pode ser um número" });
    }

    if (typeof descricao != 'string') {
        return res.status(400).json({ mensagem: "O descrição da categoria não pode ser um número" });
    }

    try {
        const novaCategoria = await knex('categorias').insert({
            nome,
            descricao
        }).returning('*');

        if (!novaCategoria) {
            return res.status(422).json({ mensagem: "Não foi possível cadastrar a categoria" });
        }

        return res.status(201).json(novaCategoria[novaCategoria.length - 1]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const deletarCategoria = async (req, res) => {
    const { usuario } = req;
    const { id: idCategoria } = req.params;

    const descricao = [];

    if (!idCategoria) {
        return res.status(422).json({ mensagem: "Nenhuma categoria foi selecionada" });
    }

    try {
        const transacoes = await knex('transacoes')
            .where({ usuario_id: usuario.id });

        const categoriaVinculada = transacoes.filter((transacao => {
            return transacao.categoria_id === parseInt(idCategoria)
        }));

        if (categoriaVinculada.length) {
            for (const categoria of categoriaVinculada) {
                descricao.push(categoria)
            }
            if (descricao.length === 1) {
                return res.status(422).json({
                    mensagem: "A categoria selecionada não pode ser excluída, pois possui vínculo com a seguinte transação", descricao
                });
            }
            return res.status(422).json({
                mensagem: "A categoria selecionada não pode ser excluída, pois possui vínculo com as seguintes transações", descricao
            });
        }
        const categoriaExcluida = await knex('categorias').
            where({ id: idCategoria })
            .del();

        if (!categoriaExcluida) {
            return res.status(400).json({ "mensagem": "A categoria não foi excluída" });
        }

        return res.status(200).json({ mensagem: "Categoria excluída com sucesso" });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarCategoria,
    adicionarCategoria,
    deletarCategoria
};