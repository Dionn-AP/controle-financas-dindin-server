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
        return res.status(500).json({ mensagem: "O nome da categoria não pode ser um número" });
    }

    if (typeof descricao != 'string') {
        return res.status(500).json({ mensagem: "O descrição da categoria não pode ser um número" });
    }

    try {
        const novaCategoria = await knex('categorias').insert({
            nome,
            descricao: descricao ? descricao : ""
        }).returning('*');

        if (!novaCategoria) {
            return res.status(400).json({ mensagem: "Não foi possível cadastrar a categoria" });
        }

        return res.status(201).json({ message: "Nova categoria cadastrada com sucesso" });
    } catch (error) {
        return res.status(400).json(error.message);
    }

}

module.exports = {
    listarCategoria,
    adicionarCategoria
};