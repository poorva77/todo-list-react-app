import { useState } from "react";
import TodoItem from "./components/TodoItem";
import Stopwatch from "./components/Stopwatch";
import "./App.css";

let nextId = 1;

function App() {
  const [inputText, setInputText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const addTask = () => {
    if (inputText.trim() === "") return;
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: inputText.trim(),
        status: "todo",
        priority,
        elapsed: 0,
        createdAt: new Date().toLocaleTimeString(),
      },
    ]);
    setInputText("");
    setPriority("medium");
    setShowForm(false);
  };

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));
  const updateTask = (updated) => setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const completePct = tasks.length ? Math.round((counts.done / tasks.length) * 100) : 0;

  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-dot" />
          <span className="brand-name">Focus</span>
        </div>

        <Stopwatch />

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-value">{tasks.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card stat-progress">
            <div className="stat-value">{counts["in-progress"]}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card stat-done">
            <div className="stat-value">{counts.done}</div>
            <div className="stat-label">Done</div>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-header">
            <span>Progress</span>
            <span className="progress-pct">{completePct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completePct}%` }} />
          </div>
        </div>

        <nav className="filter-nav">
          {[
            { key: "all", icon: "⊞", label: "All Tasks" },
            { key: "todo", icon: "○", label: "To Do" },
            { key: "in-progress", icon: "◑", label: "In Progress" },
            { key: "done", icon: "●", label: "Done" },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              className={`nav-item ${filter === key ? "active" : ""}`}
              onClick={() => setFilter(key)}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
              <span className="nav-count">{counts[key]}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div>
            <h1 className="main-title">
              {filter === "all" ? "All Tasks" : filter === "in-progress" ? "In Progress" : filter === "done" ? "Done" : "To Do"}
            </h1>
            <p className="main-subtitle">
              {filtered.length} task{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button className="new-task-btn" onClick={() => setShowForm(true)}>
            <span className="plus-icon">＋</span>
            New Task
          </button>
        </header>

        {showForm && (
          <div className="task-form-overlay" onClick={() => setShowForm(false)}>
            <div className="task-form-card" onClick={(e) => e.stopPropagation()}>
              <div className="form-header">
                <h2>New Task</h2>
                <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <input
                className="task-input"
                type="text"
                placeholder="What needs to be done?"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                autoFocus
              />
              <div className="form-footer">
                <div className="priority-selector">
                  <span className="priority-label">Priority</span>
                  {["low", "medium", "high"].map((p) => (
                    <button
                      key={p}
                      className={`priority-opt priority-${p} ${priority === p ? "selected" : ""}`}
                      onClick={() => setPriority(p)}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="form-actions">
                  <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  <button className="add-btn" onClick={addTask}>Add Task</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="task-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              {/*<div className="empty-icon">✦</div>*/}
              <p className="empty-text">No tasks here yet</p>
              <button className="empty-add-btn" onClick={() => setShowForm(true)}>
                ＋ Add your first task
              </button>
            </div>
          ) : (
            filtered.map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                deleteTask={() => deleteTask(task.id)}
                updateTask={updateTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;