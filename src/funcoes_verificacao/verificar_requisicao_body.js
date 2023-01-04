const yup = require('yup');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');
setLocale(pt);

const schemaCadastroUsuario = yup.object().shape({
    senha: yup.string().required().min(8).max(12),
    email: yup.string().email().required(),
    nome: yup.string().required()
});

const schemaLogin = yup.object().shape({
    email: yup.string().email().required(),
    senha: yup.string().required().min(8).max(12)
});

const schemaCadastroTransacao = yup.object().shape({
    descricao: yup.string(),
    data: yup.string().required(),
    categoria_id: yup.string().required(),
    valor: yup.number().required(),
    tipo: yup.string().required()
    
});

module.exports = {
    schemaCadastroUsuario,
    schemaCadastroTransacao,
    schemaLogin
};