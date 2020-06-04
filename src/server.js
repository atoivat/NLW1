const express = require("express");
const server = express();

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
    return res.render("search-results.html");
})

// Adaptacao pro Heroku
const PORT = process.env.PORT || 3000;

// Ligar o servidor
server.listen(PORT);