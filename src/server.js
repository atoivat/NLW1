const express = require("express");
const server = express();

// Pegar o banco de dados
const db = require("./database/db");

// Pasta public
server.use(express.static("public"));

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
    return res.render("create-point.html");
})

// Search results
server.get("/search", (req, res) => {

    // Pegar dados do db
    db.all(`SELECT * FROM places`, function(err, rows){
        if(err){
            return console.log(err);
        }
        
        const total = rows.length;

        // Mostrar a pag html com os dados do db
        return res.render("search-results.html", { places: rows, total});
    });

})

// Adaptacao pro Heroku
const PORT = process.env.PORT || 3000;

// Ligar o servidor
server.listen(PORT);