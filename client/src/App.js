import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [book, setBook] = useState([]);
  const [name, setName] = useState();
  const [number, setNumber] = useState();

  const showPersonsList = async () => {
    const { data } = await axios.get('/api/persons')
    setBook(data);
  }

  useEffect(() => {
    showPersonsList();
  }, [])

  const handleDelete = (e) => {
    axios.delete(`/api/persons/${e.target.id}`)
    showPersonsList();
  }

  const handleSubmit = async () => {
    const {data} = await axios.post('/api/persons', {
      name, 
      number
    });
    if (data) {
      console.log(data);
      await axios.put(`/api/persons/${data}`, { name, number } );
    }
    showPersonsList();
  }

  return (
    <div className="App">
      <h1>Phone Book</h1>
      <ul>
        {book.map(item => 
          <li>{item.name} {item.number} <button id={item.id} onClick={handleDelete}>delete</button></li>
        )}
      </ul>

      <form onSubmit={handleSubmit}>
        <input onChange={(e) => setName(e.target.value)} type='text' placeholder='name'/>
        <input onChange={(e) => setNumber(e.target.value)} type='text' placeholder='number'/>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default App;
