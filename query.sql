--CRIACAO DA TABELA CATEGORIAS

create table usuarios(
    id serial primary key,
    nome text not null,
    email varchar(150) unique not null,
    senha text not null
);

--CRIACAO DA TABELA CATEGORIAS
drop table if exists categorias;

create table categorias (
    id serial primary key,
    nome varchar(30) not null,
    descricao text not null,
    usuario_id integer,
    foreign key (usuario_id) references usuarios (id)
);

--CRIACAO DA TABELA TRANSACOES
drop table if exists transacoes;

create table transacoes (
    id serial primary key,
    descricao text,
    valor int not null,
    data date,
    categoria_id integer not null,
    usuario_id integer not null,
    foreign key (categoria_id) references categorias (id),
    foreign key (usuario_id) references usuarios (id),
    tipo varchar(8) not null
);