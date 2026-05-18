import { useState, useEffect, useRef } from "react";

function TodoItem({ task, deleteTask, updateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [elapsed, setElapsed] = useState(task.elapsed || 0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (task.status === "in-progress") {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          updateTask({ ...task, elapsed: next });
          return next;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [task.status, task, updateTask]);

  useEffect(() => {
    setElapsed(task.elapsed || 0);
  }, [task.elapsed]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const cycleStatus = () => {
    const cycle = { todo: "in-progress", "in-progress": "done", done: "todo" };
    updateTask({ ...task, elapsed: elapsed, status: cycle[task.status] });
  };

  const saveEdit = () => {
    if (editText.trim()) {
      updateTask({ ...task, text: editText.trim() });
    }
    setIsEditing(false);
  };

  const statusConfig = {
    todo: { label: "To Do", icon: "○", cls: "status-todo" },
    "in-progress": { label: "In Progress", icon: "◑", cls: "status-progress" },
    done: { label: "Done", icon: "●", cls: "status-done" },
  };

  const priorityConfig = {
    low: { label: "Low", cls: "priority-low" },
    medium: { label: "Med", cls: "priority-medium" },
    high: { label: "High", cls: "priority-high" },
  };

  const cyclePriority = () => {
    const cycle = { low: "medium", medium: "high", high: "low" };
    updateTask({ ...task, priority: cycle[task.priority || "low"] });
  };

  const cfg = statusConfig[task.status];
  const pcfg = priorityConfig[task.priority || "low"];

  return (
    <div className={`todo-item ${task.status === "done" ? "done" : ""} ${task.status === "in-progress" ? "in-progress" : ""}`}>
      <div className="todo-left">
        <button className={`status-btn ${cfg.cls}`} onClick={cycleStatus} title="Cycle status">
          <span className="status-icon">{cfg.icon}</span>
        </button>

        <div className="todo-content">
          {isEditing ? (
            <input
              className="edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setIsEditing(false); }}
              autoFocus
            />
          ) : (
            <span className="task-text" onDoubleClick={() => setIsEditing(true)}>{task.text}</span>
          )}
          <div className="task-meta">
            <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>
            <button className={`priority-badge ${pcfg.cls}`} onClick={cyclePriority}>{pcfg.label}</button>
            {(task.status === "in-progress" || elapsed > 0) && (
              <span className="timer-display">
                <span className="timer-dot" />
                {formatTime(elapsed)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="todo-actions">
        <button className="action-btn edit-btn" onClick={() => setIsEditing(true)} title="Edit">
          ✎
        </button>
        <button className="action-btn delete-btn" onClick={deleteTask} title="Delete">
          ✕
        </button>
      </div>
    </div>
  );
}

export default TodoItem;