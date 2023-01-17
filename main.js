const express = require("express");
const bodyParser = require("body-parser");
const pg = require('pg');

const config = {
  user: 'todos_db_f81u_user',
  database: 'todos_db_f81u',
  password: 'BeCKQXBesddVu8Jjpn2Coxc9qIntWzS6',
  host: 'dpg-cf27ncirrk0bpparh6cg-a.oregon-postgres.render.com',
  port: 5432,
  ssl: true,
  idleTimeoutMillis: 30000,
}

const client = new pg.Pool(config)

// Modelo
class TodoModel {
  constructor() {
    this.todos = [];
  }

  async getTodos(){
    const res = await client.query('select * from usuarios')
    console.log(res);
    return res.rows;
  }

  async addTodo(todoName, todoAges) {
    const query = 'INSERT INTO usuarios(nombre, edad) VALUES($1, $2) RETURNING *'
    const values = [todoName, todoAges]
    const res = await client.query(query, values)
    return res;
  }

  editTodo(index, todoText) {
    this.todos[index].text = todoText;
  }

  deleteTodo(index) {
    this.todos.splice(index, 1);
  }

  toggleTodo(index) {
    this.todos[index].completed = !this.todos[index].completed;
  }
}

// Controlador
class TodoController {
  constructor(model) {
    this.model = model;
  }

  async getTodos() {
    return await this.model.getTodos();
  }
  async addTodo(todoName, todoAges) {
    await this.model.addTodo(todoName, todoAges);
  }
  async getStatus(){
    return {nombre: 'juan jose quiroga Torrez', email: 'lobodlv17@gmail.com'}
  }

  editTodo(index, todoText) {
    this.model.editTodo(index, todoText);
  }

  deleteTodo(index) {
    this.model.deleteTodo(index);
  }

  toggleTodo(index) {
    this.model.toggleTodo(index);
  }
}

// Vistas (Rutas)
const app = express();
const todoModel = new TodoModel();
const todoController = new TodoController(todoModel);

app.use(bodyParser.json());

app.get("/users", async (req, res) => {
  const response = await todoController.getTodos()
  res.json(response)
  
  //res.send(todoController.model.todos);
});

// Vistas (Rutas) (continuación)
app.post("/users", (req, res) => {
  const todoName = req.body.nombre;
  const todoAges = req.body.edad;
  console.log(req.body)
  todoController.addTodo(todoName, todoAges);
  res.sendStatus(200);
});

app.put("/todos/:index", (req, res) => {
  const index = req.params.index;
  const todoText = req.body.text;
  todoController.editTodo(index, todoText);
  res.sendStatus(200);
});

app.delete("/todos/:index", (req, res) => {
  const index = req.params.index;
  todoController.deleteTodo(index);
  res.sendStatus(200);
});

app.patch("/todos/:index", (req, res) => {
  const index = req.params.index;
  todoController.toggleTodo(index);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
