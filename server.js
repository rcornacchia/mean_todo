var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/myapp');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

// define model
var Todo = mongoose.model('Todo', {
    text : String
});

// routes
// GET
app.get('/api/todos', function(req, res) {
    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {
        // if there is an error, send error
        if (err) res.send(err);
        res.json(todos);
    });
});

// POST - create a Todo
app.post('/api/todos', function(req, res) {
    Todo.create({
        text: req.body.text,
        done: false
    }, function(err, todo) {
        if (err)
            res.send(err);
        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if(err)
                res.send(err);
            res.json(todos);
        });
    });
});

// delete a post
app.delete('/api/todos/:todo_id', function(req, res){
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if(err)
            res.send(err);
        // get and return all the todos after you delete one
        Todo.find(function(err, todos) {
            if(err)
                res.send(err);
            res.json(todos);
        });
    });
});

var Todo = mongoose.model('Todo', {
    text: String
});

app.listen(8081);
console.log("App listening on port 8080");
