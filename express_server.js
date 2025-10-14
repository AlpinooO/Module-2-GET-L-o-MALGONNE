const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.headers);
  console.log(req.body);
  res.send("Hello World!");
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

app.post("/data", (req, res) => {
  console.log(req.body);
  res.send("Données reçues");
});

let tasks = [];

app.get("/task", (req, res) => {
  res.json(tasks);
});

app.post("/new-task", (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    description: req.body.description,
    isDone: req.body.isDone || false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/update-task/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  tasks[taskIndex] = {
    id: taskId,
    title: req.body.title || tasks[taskIndex].title,
    description: req.body.description || tasks[taskIndex].description,
    isDone:
      req.body.isDone !== undefined ? req.body.isDone : tasks[taskIndex].isDone,
  };
  res.json(tasks[taskIndex]);
});

app.delete("/delete-task/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
