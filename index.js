const express = require("express");
const bodyParser = require("body-parser");
const dbKnex = require("./database/db");
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/games", (req, res) => {
    dbKnex.select().from("game").then(data => {
        res.json(data);
    }).catch(err => {
        console.log(err);
    })
})

app.get("/game/:id", (req, res) => {
    if(isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        
        dbKnex("game").where({ id: id }).select("*").then(data => {
            if(data != "") {
                res.status(200);
                res.json(data);
            } else {
                res.sendStatus(404);
            }
        }).catch(err => {
            console.log(err);
        })
    }
})

app.post("/game", (req, res) => {
    var { nome, preco } = req.body

    if(nome != undefined && preco != undefined) {
        dbKnex("game").insert({ nome: nome, preco: preco }).then(data => {
            res.sendStatus(201)
        }).catch(err => {
            console.log(err)
        })
    } else {
        if(nome == undefined && preco == undefined) {
            res.status(400)
            res.json({nome: "undefined", preco: "undefined"})
        }
        if(nome == undefined) {
            res.status(400)
            res.json({nome: "undefined"})
        }
        if(preco == undefined) {
            res.status(400)
            res.json({preco: "undefined"})
        }
    }
})

app.put("/game/:id", (req, res) => {
    if(isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);
        var { nome, preco } = req.body;

        dbKnex("game").where({ id: id }).update({ nome: nome, preco: preco}).then(data => {
            if(!data) {
                res.sendStatus(404)
            } else {
                res.sendStatus(200)
            }
        }).catch(err => {
            console.log(err)
        })
    }
})

app.delete("/game/:id", (req, res) => {
    if(isNaN(req.params.id)) {
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);

        dbKnex.where({ id: id }).delete().table("game").then(data => {
            if(!data) {
                res.sendStatus(404)
            } else {
                res.sendStatus(200)
            }
        }).catch(err => {
            console.log(err)
        })
    }
})

app.listen(3000);