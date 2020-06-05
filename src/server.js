const express = require("express");
const server = express();

// Pegar o banco de dados
const db = require("./database/db");

// Pasta public
server.use(express.static("public"));

// Habilitar req.body
server.use(express.urlencoded({ extended: true }));

// Template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
});


// Configura caminhos
// Pagina inicial
// req >> requisicao
// res >> resposta
server.get("/", (req, res) => {
    return res.render("index.html");
})

// Create point
server.get("/create-point", (req, res) => {
    // Query strings da url    
    // console.log(req.query);

    return res.render("create-point.html");
});

server.post("/savepoint", (req, res) => {
    // req.body: o corpo do form
    // console.log(req.body);

    // Inserir dados no db
        const query = `
        INSERT INTO places (
            image,
            name,
            adress,
            adress2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `;

    const values = [
        req.body.image,
        req.body.name,
        req.body.adress,
        req.body.adress2,
        req.body.state,
        req.body.city,
        req.body.items
    ];

    function afterInsertData(err) {
        if(err){
            console.log(err);
            return res.send("Erro no cadastro");
        }

        console.log("Cadastrado com sucesso.");
        console.log(this);


        return res.render("create-point.html", { saved: true });
    };

    db.run(query, values, afterInsertData);


});

// Search results
server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // Caso da pesquisa vazia
        return res.render("search-results.html", { total: 0});
    }

    // Pegar dados do db
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err);
        }
        
        const total = rows.length;

        // Mostrar a pag html com os dados do db
        return res.render("search-results.html", { places: rows, total});
    });

});

// Adaptacao pro Heroku
const PORT = process.env.PORT || 3000;

// Ligar o servidor
server.listen(PORT);