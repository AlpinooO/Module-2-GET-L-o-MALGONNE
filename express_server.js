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
