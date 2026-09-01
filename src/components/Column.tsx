import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ColumnId, Task } from '../types';
import { TaskCard } from './TaskCard';

interface Props {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onAdd: (columnId: ColumnId) => void;
  onEdit: (task: Task) => void;
}

export function Column({ id, title, tasks, onAdd, onEdit }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <section className={'column' + (isOver ? ' column--over' : '')}>
      <header className="column__header">
        <h2 className="column__title">{title}</h2>
        <span className="column__count">{tasks.length}</span>
        <button
          className="column__add"
          onClick={() => onAdd(id)}
          aria-label={`Nova tarefa em ${title}`}
        >
          +
        </button>
      </header>

      <div ref={setNodeRef} className="column__list">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <p className="column__empty">Arraste um card ou clique em +</p>
        )}
      </div>
    </section>
  );
}
