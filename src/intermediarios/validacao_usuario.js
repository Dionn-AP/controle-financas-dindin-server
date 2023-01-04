const knex = require('../conexao');
const jwt = require('jsonwebtoken');

const validacaoUsuarioLogado = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    try {
        const token = authorization.replace('Bearer ', "").trim();

        const { id } = jwt.verify(token, process.env.SECRET_KEY);

        const usuarioLogado = await knex('usuarios')
            .where({ id })
            .first();

        if (!usuarioLogado) {
            return res.status(404).json({ "mensagem": "Usuário não encontrado." })
        }

        req.usuario = usuarioLogado;

        next();

    } catch {
        return res.status(400).json("O token é inválido.")
    }
};


module.exports = validacaoUsuarioLogado;