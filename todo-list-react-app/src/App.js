import { useState } from "react";
import TodoItem from "./components/TodoItem";
import "./App.css";

function App() {

    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);

    const addTask = () => {

        if(task.trim() === "") {
            return;
        }

        setTasks([...tasks, task]);
        setTask("");
    };

    const deleteTask = (index) => {

        const updatedTasks = tasks.filter(
            (_, i) => i !== index
        );

        setTasks(updatedTasks);
    };

    return (

        <div className="container">

            <h1>Todo List App</h1>

            <div className="input-section">

                <input
                    type="text"
                    placeholder="Enter task..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />

                <button onClick={addTask}>
                    Add
                </button>

            </div>

            <div className="task-list">

                {tasks.map((item, index) => (

                    <TodoItem
                        key={index}
                        task={item}
                        deleteTask={() => deleteTask(index)}
                    />

                ))}

            </div>

        </div>
    );
}

export default App;