function TodoItem({ task, deleteTask }) {
    return (
        <div className="todo-item">
            <span>{task}</span>

            <button onClick={deleteTask}>
                Delete
            </button>
        </div>
    );
}

export default TodoItem;