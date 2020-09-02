require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('req-body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '');

app.use(express.static('./build'));
app.use(cors());
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

// const generateID = () => {
//     const lastId = persons.length > 0 ? persons.length : 0;
//     return lastId + 1;
// }

app.get('/api/persons', (req, res) => {
    Person.find({}).then(person => {
      res.json(person)
    })
  })

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`Phonebook has info for ${persons.length} people. \n${date}`);
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end();
        }
    })
    .catch(err => next(err));
  })

app.post('/api/persons', async (req, res) => {
    const {name = undefined, number = undefined} = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: "Missing name or number." });
    }

    const result = await Person.find({name});
    if (result.length) {
        return res.status(400).json({ error: "Name already exists.", id: result[0].id });
    } else {
        const person = new Person({
            name,
            number
        });

        person.save().then(savedPerson => {
            res.json(savedPerson);
        })
    }
});

app.put('/api/persons/:id', (request, response, next) => {
    const {name = undefined, number = undefined} = request.body
  
    const person = {
      name,
      number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end();
    })
    .catch(err => next(err))
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown Endpoint' })
  }
  
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send( { error: 'No Person Found...' } );
    } 
  
    next(error)
  }
  
  app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
})