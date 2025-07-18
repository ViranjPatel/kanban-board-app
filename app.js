const { useState, useEffect } = React;

const KanbanBoard = () => {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('kanbanTasks');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [draggedTask, setDraggedTask] = useState(null);

    const columns = [
        { id: 'todo', title: 'To Do', color: '#3498db' },
        { id: 'inprogress', title: 'In Progress', color: '#f39c12' },
        { id: 'done', title: 'Done', color: '#27ae60' }
    ];

    useEffect(() => {
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (e) => {
        e.preventDefault();
        if (newTask.title.trim()) {
            const task = {
                id: Date.now(),
                title: newTask.title,
                description: newTask.description,
                status: 'todo',
                priority: 'medium',
                createdAt: new Date().toISOString()
            };
            setTasks([...tasks, task]);
            setNewTask({ title: '', description: '' });
        }
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.target.classList.add('dragging');
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
        setDraggedTask(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e, status) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        if (draggedTask) {
            setTasks(tasks.map(task => 
                task.id === draggedTask.id ? { ...task, status } : task
            ));
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const changePriority = (taskId) => {
        const priorities = ['low', 'medium', 'high'];
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                const currentIndex = priorities.indexOf(task.priority);
                const nextIndex = (currentIndex + 1) % priorities.length;
                return { ...task, priority: priorities[nextIndex] };
            }
            return task;
        }));
    };

    return (
        <div className="app">
            <div className="header">
                <h1>📋 Kanban Board</h1>
                <form onSubmit={addTask} className="add-task-form">
                    <input
                        type="text"
                        placeholder="Task title..."
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Description (optional)..."
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <button type="submit">Add Task</button>
                </form>
            </div>

            <div className="board">
                {columns.map(column => {
                    const columnTasks = getTasksByStatus(column.id);
                    return (
                        <div
                            key={column.id}
                            className="column"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            <div className="column-header">
                                <h3 className="column-title">{column.title}</h3>
                                <span className="task-count">{columnTasks.length}</span>
                            </div>
                            <div className="task-list">
                                {columnTasks.length === 0 ? (
                                    <div className="empty-state">No tasks yet</div>
                                ) : (
                                    columnTasks.map(task => (
                                        <div
                                            key={task.id}
                                            className="task-card"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task)}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <button
                                                className="delete-task"
                                                onClick={() => deleteTask(task.id)}
                                                title="Delete task"
                                            >
                                                ×
                                            </button>
                                            <h4 className="task-title">{task.title}</h4>
                                            {task.description && (
                                                <p className="task-description">{task.description}</p>
                                            )}
                                            <div className="task-meta">
                                                <span 
                                                    className={`task-priority priority-${task.priority}`}
                                                    onClick={() => changePriority(task.id)}
                                                    style={{ cursor: 'pointer' }}
                                                    title="Click to change priority"
                                                >
                                                    {task.priority}
                                                </span>
                                                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

ReactDOM.render(<KanbanBoard />, document.getElementById('root'));