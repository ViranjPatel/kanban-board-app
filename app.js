const { useState, useEffect, useRef } = React;

// Initialize Lucide icons
lucide.createIcons();

const KanbanBoard = () => {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('kanbanTasks');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
    const [draggedTask, setDraggedTask] = useState(null);
    const [draggedOverTask, setDraggedOverTask] = useState(null);
    const [selectedPriority, setSelectedPriority] = useState('medium');
    
    const columns = [
        { id: 'todo', title: 'To Do', icon: 'circle-dashed', color: 'text-blue-600' },
        { id: 'inprogress', title: 'In Progress', icon: 'loader-circle', color: 'text-amber-600' },
        { id: 'done', title: 'Done', icon: 'check-circle-2', color: 'text-green-600' }
    ];

    const priorities = [
        { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
        { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
        { value: 'high', label: 'High', color: 'bg-red-100 text-red-700 hover:bg-red-200' }
    ];

    useEffect(() => {
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        // Re-initialize icons when component updates
        lucide.createIcons();
    });

    const addTask = (e) => {
        e.preventDefault();
        if (newTask.title.trim()) {
            const task = {
                id: Date.now(),
                title: newTask.title,
                description: newTask.description,
                dueDate: newTask.dueDate,
                status: 'todo',
                priority: selectedPriority,
                createdAt: new Date().toISOString(),
                order: tasks.filter(t => t.status === 'todo').length
            };
            setTasks([...tasks, task]);
            setNewTask({ title: '', description: '', dueDate: '' });
            setSelectedPriority('medium');
        }
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleDragStart = (e, task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = 'move';
        // Add better visual feedback
        setTimeout(() => {
            e.target.style.opacity = '0.4';
            e.target.style.transform = 'scale(1.02)';
        }, 0);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '';
        e.target.style.transform = '';
        setDraggedTask(null);
        setDraggedOverTask(null);
        // Remove all drag-over classes
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
        document.querySelectorAll('.drag-over-top').forEach(el => {
            el.classList.remove('drag-over-top');
        });
        document.querySelectorAll('.drag-over-bottom').forEach(el => {
            el.classList.remove('drag-over-bottom');
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnterColumn = (e, status) => {
        e.preventDefault();
        if (e.currentTarget.classList.contains('column-drop-zone')) {
            e.currentTarget.classList.add('drag-over');
        }
    };

    const handleDragLeaveColumn = (e) => {
        if (e.currentTarget.classList.contains('column-drop-zone')) {
            e.currentTarget.classList.remove('drag-over');
        }
    };

    const handleDragOverTask = (e, task) => {
        if (!draggedTask || draggedTask.id === task.id) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;
        
        // Remove previous classes
        e.currentTarget.classList.remove('drag-over-top', 'drag-over-bottom');
        
        // Add class based on position
        if (y < height / 2) {
            e.currentTarget.classList.add('drag-over-top');
        } else {
            e.currentTarget.classList.add('drag-over-bottom');
        }
        
        setDraggedOverTask({ task, insertBefore: y < height / 2 });
    };

    const handleDragLeaveTask = (e) => {
        e.currentTarget.classList.remove('drag-over-top', 'drag-over-bottom');
    };

    const handleDropOnColumn = (e, status) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        if (draggedTask && !draggedOverTask) {
            // Dropped on empty column or at the end
            const columnTasks = tasks.filter(t => t.status === status);
            const maxOrder = columnTasks.length > 0 ? Math.max(...columnTasks.map(t => t.order || 0)) : -1;
            
            setTasks(tasks.map(task => 
                task.id === draggedTask.id 
                    ? { ...task, status, order: maxOrder + 1 } 
                    : task
            ));
        }
    };

    const handleDropOnTask = (e, targetTask) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('drag-over-top', 'drag-over-bottom');
        
        if (!draggedTask || draggedTask.id === targetTask.id) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const insertBefore = y < rect.height / 2;
        
        // Reorder tasks
        let newTasks = [...tasks];
        const draggedIndex = newTasks.findIndex(t => t.id === draggedTask.id);
        const targetIndex = newTasks.findIndex(t => t.id === targetTask.id);
        
        // Remove dragged task
        const [removed] = newTasks.splice(draggedIndex, 1);
        
        // Update status if dropping in different column
        removed.status = targetTask.status;
        
        // Find new index after removal
        const newTargetIndex = newTasks.findIndex(t => t.id === targetTask.id);
        const insertIndex = insertBefore ? newTargetIndex : newTargetIndex + 1;
        
        // Insert at new position
        newTasks.splice(insertIndex, 0, removed);
        
        // Update order for all tasks in the column
        const columnTasks = newTasks.filter(t => t.status === removed.status);
        columnTasks.forEach((task, index) => {
            task.order = index;
        });
        
        setTasks(newTasks);
        setDraggedOverTask(null);
    };

    const getTasksByStatus = (status) => {
        return tasks
            .filter(task => task.status === status)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    };

    const getPriorityClass = (priority) => {
        const p = priorities.find(p => p.value === priority);
        return p ? p.color : priorities[1].color;
    };

    const getDueDateStatus = (dueDate) => {
        if (!dueDate) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { text: 'Overdue', class: 'text-red-600 font-medium' };
        if (diffDays === 0) return { text: 'Due today', class: 'text-orange-600 font-medium' };
        if (diffDays === 1) return { text: 'Due tomorrow', class: 'text-amber-600' };
        if (diffDays <= 3) return { text: `${diffDays} days`, class: 'text-yellow-600' };
        return { text: `${diffDays} days`, class: 'text-gray-600' };
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <style>{`
                .drag-over {
                    background-color: #e0f2fe !important;
                    border: 2px dashed #3b82f6 !important;
                }
                .drag-over-top {
                    border-top: 3px solid #3b82f6 !important;
                }
                .drag-over-bottom {
                    border-bottom: 3px solid #3b82f6 !important;
                }
                .dragging {
                    cursor: grabbing !important;
                }
            `}</style>
            
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <i data-lucide="layout-dashboard" className="w-6 h-6"></i>
                            Kanban Board
                        </h1>
                    </div>
                </div>
            </div>

            {/* Add Task Form */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <form onSubmit={addTask} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="What needs to be done?"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            <input
                                type="text"
                                placeholder="Add a description (optional)"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            <input
                                type="date"
                                placeholder="Due date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                            <div className="flex gap-2">
                                <div className="flex rounded-md shadow-sm">
                                    {priorities.map(priority => (
                                        <button
                                            key={priority.value}
                                            type="button"
                                            onClick={() => setSelectedPriority(priority.value)}
                                            className={`px-3 py-2 text-xs font-medium transition-colors first:rounded-l-md last:rounded-r-md ${
                                                selectedPriority === priority.value
                                                    ? priority.color.replace('hover:', '')
                                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {priority.label}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    <i data-lucide="plus" className="w-4 h-4 mr-2"></i>
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map(column => {
                        const columnTasks = getTasksByStatus(column.id);
                        return (
                            <div 
                                key={column.id} 
                                className="column-drop-zone bg-gray-50 rounded-lg p-4 transition-all duration-200"
                                onDragOver={handleDragOver}
                                onDragEnter={(e) => handleDragEnterColumn(e, column.id)}
                                onDragLeave={handleDragLeaveColumn}
                                onDrop={(e) => handleDropOnColumn(e, column.id)}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <i data-lucide={column.icon} className={`w-5 h-5 ${column.color}`}></i>
                                        <h3 className="font-semibold text-gray-900">{column.title}</h3>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                        {columnTasks.length}
                                    </span>
                                </div>
                                
                                <div className="space-y-3 min-h-[400px]">
                                    {columnTasks.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500 text-sm">
                                            <i data-lucide="inbox" className="w-8 h-8 mx-auto mb-2 text-gray-400"></i>
                                            Drop tasks here
                                        </div>
                                    ) : (
                                        columnTasks.map(task => {
                                            const dueDateStatus = getDueDateStatus(task.dueDate);
                                            return (
                                                <div
                                                    key={task.id}
                                                    className="bg-white rounded-lg border p-4 cursor-grab hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, task)}
                                                    onDragEnd={handleDragEnd}
                                                    onDragOver={(e) => handleDragOverTask(e, task)}
                                                    onDragLeave={handleDragLeaveTask}
                                                    onDrop={(e) => handleDropOnTask(e, task)}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
                                                        <button
                                                            onClick={() => deleteTask(task.id)}
                                                            className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                                                        >
                                                            <i data-lucide="x" className="w-4 h-4"></i>
                                                        </button>
                                                    </div>
                                                    
                                                    {task.description && (
                                                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                                                    )}
                                                    
                                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                        <div className="flex items-center gap-3 text-xs">
                                                            {dueDateStatus && (
                                                                <span className={`flex items-center gap-1 ${dueDateStatus.class}`}>
                                                                    <i data-lucide="clock" className="w-3 h-3"></i>
                                                                    {dueDateStatus.text}
                                                                </span>
                                                            )}
                                                            <span className="text-gray-500 flex items-center gap-1">
                                                                <i data-lucide="calendar" className="w-3 h-3"></i>
                                                                {new Date(task.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(<KanbanBoard />, document.getElementById('root'));