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



module.exports ={
    listarCategoria
};