import { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.svg';


export function App() {

  const [toDoText, setToDoText] = useState("");
  const [todos, setTodos] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const getAllTodos = async() => {
    try {
      const res = await fetch(`${apiUrl}/todos/`);
      const response = await res.json();
      setTodos(response);
      return response;
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  }
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    if(!toDoText) {
      alert("Please enter a ToDo!");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/todos/`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({todo:toDoText})
      });

      if(response.status === 201) {
        getAllTodos();
        setToDoText("");
      } else{
        console.error("Failed to create ToDo!");
      }
    } catch (error) {
        console.error("Failed",error);
    }
  }

  useEffect(() => {
    getAllTodos()
  }, []);
  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>
        {
          todos.length > 0 ? todos.map((todo, index) => (
            <li key={index}>{todo.todo}</li>
          )) : <p>No ToDos</p>
        }
      </div>
      <div>
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label for="todo">ToDo: </label>
            <input type="text" value={toDoText} onChange={(e) => setToDoText(e.target.value)} />
          </div>
          <div style={{"marginTop": "5px"}}>
            <button>Add ToDo!</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
