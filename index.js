const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./cadastro.db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname)); // Para servir seu HTML/CSS

// 1. Criar a tabela baseada na sua imagem
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_completo TEXT,
        email TEXT,
        senha TEXT,
        permissoes TEXT,
        telefone TEXT,
        sexo TEXT,
        data_nascimento TEXT,
        cidade TEXT,
        estado TEXT,
        cep TEXT,
        rua TEXT,
        numero TEXT
    )`);
});

// 2. Rota para receber os dados do formulário
app.post('/enviar', (req, res) => {
    const { nome, email, senha, permissoes, telefone, genero, dataNasc, cidade, estado, cep, rua, nCasa } = req.body;

    const sql = `INSERT INTO usuarios (nome_completo, email, senha, permissao, telefone, sexo, data_nascimento, cidade, estado, cep, rua, numero) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [nome, email, senha, permissoes, telefone, genero, dataNasc, cidade, estado, cep, rua, nCasa], function(err) {
        if (err) {
            return res.send("Erro ao salvar: " + err.message);
        }
        // Substitua o res.send antigo por esse dentro do app.post('/enviar')
res.send("<script>alert('Cadastrado com sucesso!'); window.location.href='/';</script>");
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'formulario.html'));
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});

// Rota para visualizar todos os usuários cadastrados
app.get('/lista-usuarios', (req, res) => {
    db.all("SELECT * FROM usuarios", [], (err, rows) => {
        if (err) {
            return res.status(500).send("Erro ao consultar o banco.");
        }
        res.json(rows); // Por enquanto, vamos apenas mostrar o JSON bruto para testar
    });
});

// Rota para mostrar a PÁGINA da lista
app.get('/usuarios', (req, res) => {
    res.sendFile(path.join(__dirname, 'lista.html'));
});

// Rota que o JavaScript (Fetch) vai usar para pegar os DADOS
app.get('/dados-usuarios', (req, res) => {
    db.all("SELECT * FROM usuarios", [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});