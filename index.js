const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('req-body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '');

app.use(cors())
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

let persons = [
    {
        name: "Itzik",
        number: "050-7135983",
        id: 1
    },
    {
        name: "Nadav",
        number: "058-18736612",
        id: 2
    },
    {
        name: "Maddie",
        number: "052-21891981",
        id: 3
    }

];

const generateID = () => {
    const lastId = persons.length > 0 ? persons.length : 0;
    return lastId + 1;
}

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`Phonebook has info for ${persons.length} people. \n${date}`);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    person ? res.json(person) : res.status(404).send("Person not found...");
});

app.post('/api/persons', (req, res) => {
    let newPerson = {
        name: req.body.name,
        number: req.body.number,
        id: generateID()
    }

    if (!newPerson.name || !newPerson.number) {
        return res.json({ error: "Missing name or number." });
    }

    if (persons.find((person) => person.name === newPerson.name)) {
        return res.json({ error: "Name already exists." });
    }

    persons = [...persons, newPerson]; // or persons.push(newPersons)
    res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
})