import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import TaskDetails from "./components/TaskDetails";

function App() {
  const [showAddTask, setshowAddTask] = useState(false);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };

    getTasks();
  }, []);

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch(`http://localhost:5050/task/`);
    const data = await res.json();
    return data;
  };

  // Fetch task(1)
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5050/task/${id}`);
    const data = await res.json();
    return data;
  };

  //Delte task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5050/task/${id}`, {
      method: "DELETE",
    });

    setTasks(tasks.filter((task) => task.id !== id));
  };

  //Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const upDTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`http://localhost:5050/task/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(upDTask),
    });

    const data = await res.json();

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: !task.reminder } : task
      )
    );
  };

  //Add task
  const addTask = async (task) => {
    const res = await fetch("http://localhost:5050/task", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    setTasks([...tasks, data]);

    // const id = Math.floor(Math.random()* 10000+1)
    // const newTask = {id,...task}
    // setTasks([...tasks,newTask])
  };

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setshowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}

                {tasks.length > 0 ? (
                  <Tasks
                    tasks={tasks}
                    onDelete={deleteTask}
                    onToggle={toggleReminder}
                  />
                ) : (
                  "No task to Show"
                )}
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
