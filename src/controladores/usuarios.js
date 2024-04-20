const knex = require("../conexao");
const db = require("../conexao");
const bcrypt = require("bcrypt");
const {
  schemaCadastroUsuario,
} = require("../funcoes_verificacao/verificar_requisicao_body");
const categoriasPadrao = require("../utils/dados_descricao_categoria");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    await schemaCadastroUsuario.validate(req.body);

    const emailExistente = await db("usuarios").where({ email }).first();
    
    if (emailExistente) {
      return res
        .status(400)
        .json({
          mensagem: "Este email ja foi cadastrado. Favor escolha outro email.",
        });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await db("usuarios").insert({
      nome,
      email,
      senha: senhaCriptografada,
    });

    if (!usuario) {
        return res
          .status(400)
          .json({ mensagem: "Não foi possivel cadastar o usuario" });
      }

    const novoUsuario = await db("usuarios").where({ email }).first();

    for (const cat of categoriasPadrao) {
      await db("categorias").insert({
        nome: cat.nome,
        descricao: cat.descricao,
        usuario_id: novoUsuario.id,
      });
    }

    return res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const listarPerfilUsuarios = async (req, res) => {
  return res.status(200).json({
    id: req.usuario.id,
    nome: req.usuario.nome,
    email: req.usuario.email,
  });
};

const atualizarUsuario = async (req, res) => {
  const { usuario } = req;
  const { nome, email, senha } = req.body;

  try {
    const emailExistente = await knex("usuarios").where({ email }).first();

    if (emailExistente) {
      if (emailExistente.id !== usuario.id) {
        return res.status(400).json({
          mensagem:
            "O e-mail informado já está sendo utilizado por outro usuário.",
        });
      }
    }

    const novosDadoUsuario = {
      nome: !nome ? usuario.nome : nome,
      email: !email ? usuario.email : email,
      senha: !senha ? usuario.senha : await bcrypt.hash(senha, 10),
    };

    const usuarioAtualizado = await knex("usuarios")
      .update(novosDadoUsuario)
      .where({ id: usuario.id })
      .returning("*");

    if (!usuarioAtualizado) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possível atualizar o usuario." });
    }

    return res.status(200).json({
      id: usuarioAtualizado[0].id,
      nome: usuarioAtualizado[0].nome,
      email: usuarioAtualizado[0].email
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  cadastrarUsuario,
  listarPerfilUsuarios,
  atualizarUsuario,
};
