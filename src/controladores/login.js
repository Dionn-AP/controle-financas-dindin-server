const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { schemaLogin } = require('../funcoes_verificacao/verificar_requisicao_body');

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        await schemaLogin.validate(req.body);

        const usuarioEncontrado = await knex('usuarios')
            .where({ email })
            .first();

        if (!usuarioEncontrado) { return res.status(400).json({ "mensagem": "Email ou senha incorretos." }) };

        const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senhaCorreta) {
            return res.status(400).json({ "mensagem": "Email e senha não conferem." });
        }

        const token = jwt.sign({
            id: usuarioEncontrado.id
        },
            process.env.SECRET_KEY,
            {
                expiresIn: '4h'
            });

        const { senha: _, ...dadosUsuario } = usuarioEncontrado;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    login
}