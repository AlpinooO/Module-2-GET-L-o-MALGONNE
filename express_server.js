const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  console.log(req.headers);
  console.log(req.body);
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/some-html", (req, res) => {
  res.send("<html><body><h1>bonjour html</h1></body></html>");
});

app.get("/some-json", (req, res) => {
  const personne = {
    age: 22,
    nom: "Jane",
  };
  res.json(personne);
});

app.get("/transaction", (req, res) => {
  const transaction = [100, 2000, 3000];
  res.json(transaction);
});

app.get("/search", (req, res) => {
  console.log(req.query);

  const id = req.query.id;
  const name = req.query.name;
  const age = req.query.age;

  res.json({
    allParams: req.query,
    id: id,
    name: name,
    age: age,
  });
});

app.get("/exo-query-string", (req, res) => {
  console.log(req.query);

  const age = req.query.age;
  res.send(`<h1>L'âge de la personne est : ${age}</h1>`);
});

app.get("/get-user/:userId", (req, res) => {
  const userId = req.params.userId;
  res.send(`<h1>L'ID User est : ${userId}</h1>`);
});
