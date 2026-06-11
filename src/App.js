import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (editId) {
      setTasks(
        tasks.map((task) =>
          task.id === editId
            ? { ...task, title }
            : task
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title,
          completed: false,
        },
      ]);
    }

    setTitle("");
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setEditId(task.id);
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="app-bg">
      <div className="container py-5">

        <div className="header-section">
          <h1 className="fw-bold">Task Manager</h1>
          <p className="text-muted">
            Manage your daily tasks efficiently.
          </p>
        </div>

        <div className="row mb-4">

          <div className="col-md-4 mb-3">
            <div className="stats-card">
              <h2>{tasks.length}</h2>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="stats-card">
              <h2>{completedTasks}</h2>
              <p>Completed</p>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="stats-card">
              <h2>{tasks.length - completedTasks}</h2>
              <p>Pending</p>
            </div>
          </div>

        </div>

        <div className="card custom-card mb-4">
          <div className="card-body">

            <form onSubmit={handleSubmit}>
              <div className="row g-2">

                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter your task..."
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                  />
                </div>

                <div className="col-md-3">
                  <button
                    className="btn btn-dark btn-lg w-100"
                  >
                    {editId
                      ? "Update Task"
                      : "Add Task"}
                  </button>
                </div>

              </div>
            </form>

          </div>
        </div>

        <div className="card custom-card mb-4">
          <div className="card-body">

            <div className="input-group">

              <input
                type="text"
                className="form-control"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <button className="btn btn-dark">
                <FiSearch />
              </button>

            </div>

          </div>
        </div>

        <div className="card custom-card">
          <div className="card-body">

            {filteredTasks.length === 0 ? (
              <div className="text-center py-4 text-muted">
                No tasks available
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="task-item"
                >
                  <div>

                    <h6
                      className="mb-0"
                      style={{
                        textDecoration:
                          task.completed
                            ? "line-through"
                            : "none",
                        color:
                          task.completed
                            ? "#888"
                            : "#222",
                      }}
                    >
                      {task.title}
                    </h6>

                  </div>

                  <div>

                    <button
                      className="btn btn-outline-success btn-sm me-2"
                      onClick={() =>
                        toggleComplete(task.id)
                      }
                    >
                      <FiCheckCircle />
                    </button>

                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() =>
                        handleEdit(task)
                      }
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        handleDelete(task.id)
                      }
                    >
                      <FiTrash2 />
                    </button>

                  </div>
                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;