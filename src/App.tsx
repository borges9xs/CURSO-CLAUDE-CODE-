import { useState } from 'react';
import { Board } from './components/Board';
import { TaskDialog } from './components/TaskDialog';
import { useTasks } from './store/useTasks';
import type { ColumnId, Task, TaskDraft } from './types';

export default function App() {
  const { tasks, tasksByColumn, addTask, updateTask, deleteTask, moveTask } =
    useTasks();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultColumn, setDefaultColumn] = useState<ColumnId>('backlog');

  function openCreate(columnId: ColumnId = 'backlog') {
    setEditingTask(null);
    setDefaultColumn(columnId);
    setDialogOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  function handleSave(draft: TaskDraft, id: string | null) {
    if (id) updateTask(id, draft);
    else addTask(draft);
    setDialogOpen(false);
  }

  function handleDelete(id: string) {
    deleteTask(id);
    setDialogOpen(false);
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Kanban de Tarefas</h1>
        <div className="app__header-right">
          <span className="app__total">{tasks.length} tarefas</span>
          <button className="btn btn--primary" onClick={() => openCreate('backlog')}>
            + Nova tarefa
          </button>
        </div>
      </header>

      <main className="app__main">
        <Board
          tasksByColumn={tasksByColumn}
          moveTask={moveTask}
          onAdd={openCreate}
          onEdit={openEdit}
        />
      </main>

      <TaskDialog
        open={dialogOpen}
        task={editingTask}
        defaultColumn={defaultColumn}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
