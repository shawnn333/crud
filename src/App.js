import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task.trim()) return;

    if (editId) {
      setTasks(
        tasks.map((item) =>
          item.id === editId
            ? { ...item, title: task }
            : item
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: task,
        },
      ]);
    }

    setTask("");
  };

  const handleEdit = (item) => {
    setTask(item.title);
    setEditId(item.id);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const filteredTasks = tasks.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">To-Do List CRUD</h2>

          {/* Add Task */}
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />

              <button type="submit" className="btn btn-dark">
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </form>

          {/* Search */}
          <input
            type="text"
            className="form-control mb-4"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Task Table */}
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Task</th>
                <th width="180">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No tasks found
                  </td>
                </tr>
              ) : (
                filteredTasks.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;